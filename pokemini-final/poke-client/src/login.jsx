import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthenticationContext";
import Header from "./header.jsx";

function Login() {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const { token, logout } = useContext(AuthContext);
    const [logoutMessage, setLogoutMessage] = useState("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:3000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data.token, data.user);
                setLoginMessage(`Login Successful! Welcome, ${data.user.username}`);
                setUsername("");
                setPassword("");
            } else {
                setLoginMessage(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setLoginMessage("Login Error");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3000/user/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                logout();
                setLogoutMessage(`Logout Successful!`);
            } else {
                setLogoutMessage(data.message || "Logout failed");
            }
        } catch (err) {
            console.error(err);
            setLogoutMessage("Logout Error");
        }
    };

    if (!token) {
        return (
            <div id="login">
                <Header />
                <div className="Log-Wrapper">
                    {loginMessage && <p>{loginMessage}</p>}
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
                    <button id="logIn" onClick={handleLogin}>Log In</button>
                </div>
            </div>
        );
    }
    else {
        return (
            <div id="login">
                <Header />
                <div className="Log-Wrapper">
                    {logoutMessage && <p>{logoutMessage}</p>}
                    <h2>Sad to see you go!</h2>
                    <button id="logOut" onClick={handleLogout}>Log Out</button>
                </div>

            </div>
        );
    }

}

export default Login;