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
                <ul className="app-list">
                    <li className="app-list-item">
                        <Link to="/PasswordGenerator" className="card-link">
                            <h3>Password Generator</h3>
                            <p>Generate strong and secure passwords</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link to="/PokemonWiki" className="card-link">
                            <h3>Pokemon Wiki</h3>
                            <p>See Pokemon from each Generation</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link to="/WhosThatPokemon" className="card-link">
                            <h3>Whos That Pokemon</h3>
                            <p>Whos That Pokemon Game</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link to="/Snake" className="card-link">
                            <h3>Snake</h3>
                            <p>Play the Snake game</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link to="/QRCodeGenerator" className="card-link">
                            <h3>QR Code Generator</h3>
                            <p>Create and download custom QR codes</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link to="/AgeCalculator" className="card-link">
                            <h3>Age Calculator</h3>
                            <p>Calculate your exact age and next birthday</p>
                        </Link>
                    </li>
                    <li className="app-list-item">
                        <Link
                            to="https://calendar-app-nu-self.vercel.app/"
                            className="card-link"
                        >
                            <h3>To-Do Calendar</h3>
                            <p>A Calendar with To-Do feature</p>
                        </Link>
                    </li>
                    {/* Add more Apps as needed */}
                </ul>
            </nav>
        </div>
    )
}

export default Home
