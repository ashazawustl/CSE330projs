import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthenticationContext";
import Header from "./header.jsx";

function Trade() {
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tradeOffer, setTradeOffer] = useState("");
    const [pendingOffers, setPendingOffers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/user/users");
                if (!response.ok) throw new Error(`Error fetching users: ${response.statusText}`);
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Error fetching users:", error.message);
            }
        };
        if (token) {
            fetchUsers();
            fetchPendingOffers();
        } else {
            navigate("/login"); //should redirect to login if not authenticated
        }
    }, [token, navigate]);

    const fetchPendingOffers = async () => {
        try {
            const response = await fetch("http://localhost:3000/user/user-pending-offers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setPendingOffers(data.pendingOffers);
        } catch (err) {
            console.error("Error fetching pending offers:", err);
        }
    };

    const handleUserSelection = (username) => {
        setSelectedUser(username);
    };

    const handleTradeOffer = async () => {
        if (!selectedUser || !tradeOffer) {
            alert("Please select a user and enter a trade offer.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/user/user-trade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ selectedUser, tradeOffer }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error making trade offer");
            }

            const data = await response.json();
            alert(data.message);
            setTradeOffer("");
            fetchPendingOffers(); 
        } catch (error) {
            console.error("Error sending trade offer:", error.message);
            alert(error.message);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        try {
            const response = await fetch("http://localhost:3000/user/accept-offer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ offerId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchPendingOffers(); //refresh pending offers after accepting
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error accepting offer:", err);
        }
    };

    const handleDeclineOffer = async (offerId) => {
        try {
            const response = await fetch("http://localhost:3000/user/decline-offer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ offerId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchPendingOffers(); //refresh pending offers after declining
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error declining offer:", err);
        }
    };

    return (
        <div>
            <Header />
            <div id="Trade-Wrapper">
            <h1>Pokémon Trade System</h1>
            {user && <h3>Logged in as: {user.username}</h3>}
            <h2>Users</h2>
            <ul>
                {users.length > 0 ? (
                    users.map((user) => (
                        <li
                            key={user._id}
                            onClick={() => handleUserSelection(user.username)}
                            style={{
                                cursor: "pointer",
                                color: selectedUser === user.username ? "#aa2f56" : "black",
                                fontWeight: selectedUser === user.username ? "bold" : "",
                            }}
                        >
                            {user.username}
                        </li>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </ul>
            <h2>Trade Offer</h2>
            <div>
                <label>
                    Offer to: <strong>{selectedUser || "Select a user"}</strong>
                </label>
            </div>
            <input
                type="text"
                value={tradeOffer}
                onChange={(e) => setTradeOffer(e.target.value)}
                placeholder="Enter Pokémon ID or name"
            />
            <button onClick={handleTradeOffer}>Send Trade Offer</button>

            <h2>Pending Offers</h2>
            <ul>
                {pendingOffers.map((offer) => (
                    <li key={offer.id}>
                        <p>
                            Offer from <strong>{offer.from}</strong> for Pokémon ID: {offer.pokemonId}
                        </p>
                        <button onClick={() => handleAcceptOffer(offer.id)}>Accept</button>
                        <button onClick={() => handleDeclineOffer(offer.id)}>Decline</button>
                    </li>
                ))}
            </ul>

            </div>
            
        </div>
    );
}

export default Trade;