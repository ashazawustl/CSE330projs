console.log("Hello World");
const express = require('express');
const cors = require('cors');
const fetch = import('node-fetch');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({limit: '50mb'})); //get larger requests

const userRoutes = require('./routes/userRoutes');
const pokeRoutes = require('./routes/pokeRoutes');

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri)
    .then(() => console.info("Yipeee"))
    .catch(err => console.error(err));


app.use('/user', userRoutes); //for
app.use('/poke', pokeRoutes);

//Startup express
app.listen(port, () => {
    console.info(`Server Listening on port ${port}`);
})
