import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthenticationContext";
import { Link } from "react-router-dom"; // Ensure Link is imported
import React, { useState, useEffect, useContext } from "react";

import App from "./App.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Roll from "./roll.jsx";
import Gallery from "./gallery.jsx";
import { AuthContext } from "./AuthenticationContext";
import "./index.css";

function Header() {
    const { token } = useContext(AuthContext);
    if(!token){
        return (
            <>
                <header>
                    <h1>PokeMini</h1>
                    <nav>
                        <div className="navLink"><Link to="/Register">Register</Link></div>
                        <div className="navLink"><Link to="/Login">Login</Link></div>
                    </nav>
                </header>
            </>
        );
        

    }
    else{
        return (
            <>
                <header>
                    <h1>PokeMini</h1>
                    <nav>
                        <div className="navLink"><Link to="/Login">Logout</Link></div>
                        <div className="navLink"><Link to="/Roll"> PokeGacha</Link></div>
                        <div className="navLink"><Link to="/Gallery"> View Collection</Link></div>
                        <div className="navLink"><Link to="/Trade">Trade</Link></div>
                        <div className="navLink"></div>
                    </nav>
                </header>
            </>
        );

    }
    
}

export default Header;