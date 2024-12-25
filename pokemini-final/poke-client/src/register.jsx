import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header.jsx";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerMessage, setRegisterMessage] = useState("");

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setRegisterMessage(`Register Successful! Welcome, ${data.user.username}`);
                setUsername("");
                setPassword("");
            } else {
                setRegisterMessage(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err);
            setRegisterMessage("Register Error");
        }
    };

    return (
        <div id="register">
            <Header />
            <div className="Log-Wrapper">
                {registerMessage && <p>{registerMessage}</p>}
                <label htmlFor="usernameField">Username: </label>
                <input
                    type="text"
                    id="usernameField"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <label htmlFor="passwordField">Password: </label>
                <input
                    type="password"
                    id="passwordField"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button id="register" onClick={handleRegister}>Register</button>
                <br />
                <Link to="/Login">Proceed to Log-in</Link>
            </div>

        </div>
    );
}

export default Register;