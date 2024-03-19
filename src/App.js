// src/App.js
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './components/Home'
import TopNavigationBar from './components/TopNavigationBar'
import PasswordGenerator from './components/Apps/PasswordGenerator/PasswordGenerator'
import PokemonWiki from './components/Apps/Pokemon/PokemonWiki'
import WhosThatPokemon from './components/Apps/Pokemon/WhosThatPokemon'
import SnakeGame from './components/Apps/SnakeGame/SnakeGame'
import LoginPage from './components/LoginPage'

function App() {
    const [user, setUser] = useState({})

    return (
        <Router>
            <div>
                <TopNavigationBar user={user} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/LoginPage"
                        element={<LoginPage setUser={setUser} />}
                    />
                    <Route
                        path="/PasswordGenerator"
                        element={<PasswordGenerator />}
                    />
                    <Route path="/PokemonWiki" element={<PokemonWiki />} />
                    <Route
                        path="/WhosThatPokemon"
                        element={<WhosThatPokemon />}
                    />
                    <Route path="/Snake" element={<SnakeGame />} />
                    {/* Add routes for other Apps here */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
