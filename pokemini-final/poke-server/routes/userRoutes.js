const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("../schemas/userSchema");
const Poke = require("../schemas/pokeSchema");
const secretKey = process.env.JWT_SECRET;
const blacklist = new Set();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Please Enter Username and Password" });
        }

        const userTaken = await User.findOne({ username });
        if (userTaken) {
            return res.status(400).json({ message: "Username taken" });
        }

        const newUser = new User({ username, password });
        const savedUser = await newUser.save();

        return res.status(201).json({ user: savedUser });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Please Enter Username and Password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        const userFound = await user.comparePassword(password);
        if (!userFound) {
            return res.status(401).json({ message: "Incorrect Credentials" });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });

        res.status(200).json({ message: "Login Success!", token, user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


function logout(token){
    blacklist.add(token);
}

function tokenValidity(token){
    return !blacklist.has(token); //has to be false in order to say that the user is logged out
}

router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; //get the token
        if (!token) {
            return res.status(400).json({ message: "Token is missing" });
        }
        if(tokenValidity(token)){
            logout(token);
            res.status(200).json({ message: "Logout Success!"});
        } else{
            res.status(200).json({ message: "Already logged out"});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/gallery', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userCollection = [];
        for (let pokeIndex in user.userpokemons) {
            const pokemonDetails = await Poke.findOne({ name: user.userpokemons[pokeIndex].name });
            if (pokemonDetails) {
                userCollection.push(pokemonDetails);
            }
        }
        res.status(200).json(userCollection);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      console.log("Retrieved users:", users); // Log users to verify
      res.status(200).json({ users });
    } catch (err) {
      console.error("Error retrieving users:", err);
      res.status(400).json({ message: err.message });
    }
  });

//check that user is logged in
const userCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid user" });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error("Authentication error: ", err);
        res.status(401).json({ message: "Unauthorized" });
    }
}

//update the entries for
const addNewPoke = async function (username) {
    try {
        const newPoke = {
            id: Math.floor(Math.random() * 200) + 1, //random ID between 1-200
        };

        //fetch Pokémon details from the database
        const pokeData = await Poke.findOne({ id: newPoke.id });
        if (pokeData) {
            newPoke.name = pokeData.name;
            newPoke.type = pokeData.type || "Unknown";
            newPoke.sprite = pokeData.sprite || "https://via.placeholder.com/150";
        } else {
            //if Pokémon is not found
            newPoke.name = `Pokemon-${Math.floor(Math.random() * 100)}`;
            newPoke.type = "Unknown";
            newPoke.sprite = "https://via.placeholder.com/150";
        }

        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $push: { userpokemons: newPoke } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        console.log('Updated user data: ', updatedUser);
        return newPoke;
    } catch (err) {
        console.error("Error adding Pokémon to user:", err);
        throw err;
    }
};


router.get('/user-roll', userCheck, async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userPokemons = user.userpokemons || [];
        const newPoke = await addNewPoke(req.user.username); //pass the username to `addNewPoke`
        const alreadyOwned = userPokemons.some(pokemon => pokemon.id === newPoke.id); //check whether the user already owns the pokemon that's trying to get added
        // console.log("Rolled Pokémon from backend:", newPoke);
        if(alreadyOwned){
            res.status(200).json({
                message: "You already own this Pokemon!"
            });
        } else{
            res.status(200).json({
                message: "Pokemon rolled successfully!",
                pokemon: newPoke
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

router.post('/user-trade', userCheck, async (req, res) => {
    try {
        const { selectedUser, tradeOffer } = req.body;

        if (!selectedUser || !tradeOffer) {
            return res.status(400).json({ message: "Recipient and trade offer are required" });
        }

        const recipient = await User.findOne({ username: selectedUser });
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found" });
        }
        const offer = {
            from: req.user.username, 
            pokemonOffered: tradeOffer,
            id: new mongoose.Types.ObjectId()
        };

        recipient.pendingOffers.push(offer);
        await recipient.save();
        console.log(`User ${req.user.username} offered ${tradeOffer} to ${selectedUser}`);
        res.status(200).json({ message: "Trade offer sent successfully" });
    } catch (err) {
        console.error("Error sending trade offer:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get('/user-pending-offers', userCheck, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ pendingOffers: user.pendingOffers });
});

router.post('/accept-offer', userCheck, async (req, res) => {
    const { offerId } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const offer = user.pendingOffers.find((offer) => offer.id.toString() === offerId);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        //find offer sender
        const sender = await User.findOne({ username: offer.from });
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }
        //validate offered Pokémon
        const offeredPokemon = sender.userpokemons.find((poke) => poke.name === offer.pokemonOffered);
        if (!offeredPokemon) {
            return res.status(400).json({ message: "Offer is invalid, Pokémon no longer available" });
        }
        //update sender's Pokémon list
        sender.userpokemons = sender.userpokemons.filter((poke) => poke.name !== offer.pokemonOffered);
        //add Pokémon to recipient's list
        user.userpokemons.push(offeredPokemon);
        //remove the offer from pendingOffers
        user.pendingOffers = user.pendingOffers.filter((offer) => offer.id.toString() !== offerId);

        await sender.save();
        await user.save();

        res.status(200).json({ message: "Trade offer accepted successfully", pokemon: offeredPokemon });
    } catch (err) {
        console.error("Error accepting offer:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/decline-offer', userCheck, async (req, res) => {
    const { offerId } = req.body; 
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const offer = user.pendingOffers.find((offer) => offer.id === offerId);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        user.pendingOffers = user.pendingOffers.filter((offer) => offer.id !== offerId);
        await user.save();

        res.status(200).json({ message: "Trade offer declined successfully" });
    } catch (err) {
        console.error("Error declining offer:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/validate-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "Invalid token" });

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
    }
});

/*
User-Delete-All: 
* purges all current users 
* RUN ONCE. LEAVE COMMENTED ONCE DONE.
*/
// router.get('/user-delete-all', async (req, res) => {
//     try {
//         const result = await User.deleteMany({});

//         if (result.deletedCount === 0) {
//             return res.status(404).send('No documents to delete');
//         }

//     } catch (err) {
//         console.error(err);
//         res.status(400).json({ message: err });
//     }
// })


module.exports = router;
