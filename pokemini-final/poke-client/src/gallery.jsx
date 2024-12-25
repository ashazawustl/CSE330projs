import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthenticationContext";
import { Link } from "react-router-dom"; // Ensure Link is imported
import Header from "./header.jsx";

function Gallery() {
    const { user } = useContext(AuthContext);
    const [displayMessage, setDisplayMessage] = useState("");
    const [pokeCollection, setPokeCollection] = useState([]);

    const displayCollection = async () => {
        try {
            const res = await fetch("http://localhost:3000/user/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: user.username }),
            });
            const data = await res.json();

            if (res.ok) {
                setDisplayMessage(`Collection Retrieved for ${user.username}`);
                setPokeCollection(data);
            } else {
                setDisplayMessage(data.message || "Error fetching collection");
            }
        } catch (err) {
            setDisplayMessage("Display Error");
        }
    };

    useEffect(() => {
        if (user) {
            displayCollection();
        }
    }, [user]);

    return (
        <div id="gallery">
            <Header />
            
            <div id="profile">
                <div id="user-info">
                    <h2>{user ? user.username : "Guest"}</h2>
                </div>
                <div id="stats">
                    <p>Meet Your Pokemon!</p>
                </div>
            </div>
            <div id="poke-gallery">
                {pokeCollection.length > 0 ? (
                    pokeCollection.map((pokemon) => (
                        <div key={pokemon._id} className="poke-card">
                            <h3>{pokemon.name}</h3>
                            <img
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                className="poke-image"
                            />
                            <div className="poke-stats">
                                <div className="stat">
                                    <h4>Attack:</h4>
                                    <p>{pokemon.stats[0]}</p>
                                </div>
                                <div className="stat">
                                    <h4>Defence:</h4>
                                    <p>{pokemon.stats[1]}</p>
                                </div>
                                <div className="stat">
                                    <h4>Speed:</h4>
                                    <p>{pokemon.stats[2]}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Pokémon found in your collection</p>
                )}
            </div>
        </div>
    );
}

export default Gallery;