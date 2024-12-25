import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthenticationContext";
import Header from "./header.jsx";

function Roll() {
    const { token, user } = useContext(AuthContext);
    const [rollMessage, setRollMessage] = useState("");
    const [pokemon, setPokemon] = useState("");

    const handleRoll = async () => {
        if (!token) {
            setRollMessage("Please log in to roll");
            return;
        }
        try {
            const res = await fetch("http://localhost:3000/user/user-roll", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                const rolledPokemon = data.pokemon; // Extract Pokémon
                setPokemon(rolledPokemon);
                setRollMessage("Roll successful! You got a Pokémon.");
            } else {
                setRollMessage(data.message || "Roll failed");
            }
        } catch (err) {
            console.error(err);
            setRollMessage("Roll Error");
        }
    };


    return (
        <div id="roll">
            <Header />
            <div id="roll-info">
                <h1>Roll for a Random Pokemon!!!</h1>
                {user && <p>Welcome, {user.username}!</p>}
                {rollMessage && <p>{rollMessage}</p>}
                {pokemon && (
                    <div>
                        {console.log("Rendering Pokémon:", pokemon)}
                        <h2>Your Pokémon</h2>
                        <p>Name: {pokemon.name}</p>
                        <p>Type: {pokemon.type}</p>
                        <img src={pokemon.sprite} alt={pokemon.name} />
                    </div>
                )}
                <button id="roll" onClick={handleRoll}>Roll!</button>
                <br />
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    );

}

export default Roll;