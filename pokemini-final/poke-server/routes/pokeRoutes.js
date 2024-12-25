/*
Welcome to Poke Routes, the setup router of the pokemon database.
This file is for the initial creation, and recreation of the full database
(recreation only in case of necessary purge for database cleaning)
*/

const express = require('express');
const router = express.Router();
const Poke = require('../schemas/pokeSchema');


// /*
// Poke-Delete-All: 
// * prepares database for recreation
// * by purging all current pokemon
// * RUN ONCE. LEAVE COMMENTED ONCE DONE.
// */
// // router.get('/poke-delete-all', async (req, res) => {
// //     try {
// //         const result = await Poke.deleteMany({});

// //         if (result.deletedCount === 0) {
// //             return res.status(404).send('No documents to delete');
// //         }

// //     } catch (err) {
// //         console.error(err);
// //         res.status(400).json({ message: err });
// //     }
// // })



/*
Poke-Download: 
* creates pokeObjects and fills database with first 200 pokemon in the pokedex
* Uses pokeschema to only save specific items from pokeAPI
* In case of data corruption, run Poke-Delete-All, then rerun Poke-Download
* RUN ONCE. LEAVE COMMENTED ONCE DONE.
*/
// router.get('/poke-download', async (req, res) => {
//     for (let i = 1; i <= 200; i++) {
//         try {
//             const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}/`);
//             const data = await response.json();
//             let name = data.forms[0].name;
//             let poke_id = data.id;
//             let sprite = "";
//             if(data.sprites.front_default){
//                 sprite = data.sprites.front_default;
//             }

//             let type = data.types[0].type.name;
//             let attack = data.stats[1].base_stat;
//             let def = data.stats[2].base_stat;
//             let speed = data.stats[5].base_stat;
//             let stats = [attack, def, speed];


//             const newPoke = Poke({
//                 id: poke_id,
//                 name: name,
//                 type: type,
//                 stats: stats,
//                 sprite: sprite
//             })
//             const fromMongo = await newPoke.save();
//             console.log("poke saved!");
//             console.log(newPoke);

//         } catch (err) {
//             console.error(err);
//             res.status(400).json({ message: err });
//         }
//     }
// })

module.exports = router;



/******* TESTING CODE DUMP - DO NOT DELETE ***************** */

// fetch('https://pokeapi.co/api/v2/pokemon/pikachu/')
// .then(response => response.json())
// .then(data => console.log(data.forms.name))
// .catch(error => console.error('Error:', error));
// const response = await fetch('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=200');
// const allPokemon = await response.json();
// console.log(`Name: ${name}`);
// console.log(`Id: ${poke_id}`);
// console.log(`Sprite: ${sprite}`);
// console.log(`Type: ${type}`);
// console.log(`Attack: ${stats[0]}`);
// console.log(`Defence: ${stats[1]}`);
// console.log(`Speed: ${stats[2]}`);

//             console.log(`Name: ${name}`);
//             console.log(`Id: ${poke_id}`);
//             console.log(`Sprite: ${sprite}`);
