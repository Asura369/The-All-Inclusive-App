// src/components/Home.js
import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Home.css'

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to The All Inclusive App</h1>
            <p>Explore various apps below:</p>
            <nav>
                <ul className="tool-list">
                    <li className="tool-list-item">
                        <Link to="/PasswordGenerator" className="card-link">
                            <h3>Password Generator</h3>
                            <p>Generate strong and secure passwords</p>
                        </Link>
                    </li>
                    <li className="tool-list-item">
                        <Link to="/PokemonWiki" className="card-link">
                            <h3>Pokemon Wiki</h3>
                            <p>See Pokemon from each Generation</p>
                        </Link>
                    </li>
                    <li className="tool-list-item">
                        <Link to="/WhosThatPokemon" className="card-link">
                            <h3>Whos That Pokemon</h3>
                            <p>Whos That Pokemon Game</p>
                        </Link>
                    </li>
                    {/* Add more tools as needed */}
                </ul>
            </nav>
        </div>
    )
}

export default Home
