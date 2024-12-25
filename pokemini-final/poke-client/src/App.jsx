import React from "react";
import { Link } from "react-router-dom"; // Ensure Link is imported
import Header from "./header.jsx";
import "./App.css";

function App() {

  return (
    <div className="App">
      <Header />
      <div className="App-Wrapper">
        <h2>Welcome to Pokemini!</h2>
        <div >
          <h3>How to Use</h3>
          <div>
            <ul>
              <li><b>PokeGacha:</b> roll an active gacha to collect pokemon</li>
              <li><b>Gallery:</b> View all the pokemon you've caught!</li>
              <li><b>Trade:</b> Swap pokemon with another user!</li>
            </ul>
          </div>
          <br/>
          <h3>The Team</h3>
          <h4><i>Abby Endale & Shaza Ali</i></h4>
        </div>
        
      </div>
    </div>
  );
}

export default App;