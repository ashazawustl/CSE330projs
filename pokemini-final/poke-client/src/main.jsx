import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthenticationContext"; 
import App from "./App.jsx";
import Login from "./login.jsx";
import Register from "./register.jsx";
import Roll from "./roll.jsx";
import Gallery from "./gallery.jsx";
import Trade from "./trade.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <HashRouter>
      <AuthProvider> 
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/roll" element={<Roll />} />
          {/* <Route path = "/logout" element={<Logout/>} /> */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/trade" element={<Trade />}/>
        </Routes>
      </AuthProvider>
    </HashRouter>
);