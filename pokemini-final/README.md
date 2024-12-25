[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LRsBrD_9)
# NOTE TO GRADER: Final Project on Shazwork Branch

Copy of ReadMe:
# CSE330
Shaza Ali - 508179 - ashazawustl
Abby Endale - 508412 - atendale

# PokeMini: Card Collector
## _by Shaza Ali & Abby Endale_

Welcome to our card collector game, PokeMini!
This app is run locally using React, Express NodeJS, and MongoDB. 
To use, download all files and run 'npm i' then 'npm run dev' on both the poke-client and the poke-server.
Then have some good old fashioned card gacha fun!

# FUNCTIONALITY - 55pts
## Login & Register
- To become a trainer, an account must first be registered.
- You can register several users in a row, just go to login once done creating users
- All passwords are hashed and securely stored on the MongoDB database
- Login using data of one of the registered users

## Once logged in, you can:
- Logout
- Roll on the PokeGacha 
- View a gallery of your caught pokemon
- Gift/Trade pokemon with other users

## PokeGacha
- The current version of this app has a localized collection of the first 200 pokemon in the pokedex
- Using this collection, a user can randomly "roll" for a new pokemon
- Rolling system based off of popular "Gacha" games in Japan (chance-based collection games)
- Duplicates are allowed
- Note: original collection data created using PokeAPI, localized in accordance to PokeAPI's requests

## View Collection
- Card-like gallery of pokemon owned by logged in user
- Display the images, names, and main stats of each pokemon
- Responsive display, changes the number of cards displayed depending on screen width

# LEARNING + CREATIVE PORTION (30 pts total)
- MongoDB
  - Store user data
  - Store localized minature pokeAPI
- React
  - Front-end for project, uses five main pages and a static header 
- Express/ NodeJS 

# Miscellaneous (15 pts total)
## Styling
- Responsive displays:
  - gallery changes images displayed per row based on width
  - Header text grows and shrinks based on screen width
- Page load-in/fade-in animations
- Sticky header for navigation

## Best Practices
- No errors on linting
- Proper commenting
- Passwords hashed
- .env and node-modules ignored by git

## Rubric
- Rubric submitted on time


## Credits
- Fonts used from Google Fonts
- Jayce Office Hours for initial Set-up
- Certain CSS credits (check code, intext citations)
