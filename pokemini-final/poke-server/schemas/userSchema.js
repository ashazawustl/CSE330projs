const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema; //"fancy word for class"
const Pokemon = require('../schemas/pokeSchema');

//use bcrypt for the hashed passwords
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userpokemons: [
    {
      id: Number,
      name: String
    }
  ],
  pendingOffers: [
    {
      id: String,
      from: String,
      pokemonOffered: String
    }
  ]
}, { timestamps: true }) //updates user list records

// Hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (givenPass) {
  try {
    return await bcrypt.compare(givenPass, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;