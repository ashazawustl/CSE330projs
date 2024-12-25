const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokeSchema = new Schema({
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    },
    stats:{
        type: [Number],
        required: true,
    },
    sprite:{
        type: String,
    }

}, {timestamps: true}) //updates records


const Poke = mongoose.model('Poke', pokeSchema);

//roll for pokemon from the pokes folder in DB




module.exports = Poke;