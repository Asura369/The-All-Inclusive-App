// src/App.js
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './components/Home'
import TopNavigationBar from './components/TopNavigationBar'
import PasswordGenerator from './components/Tools/PasswordGenerator/PasswordGenerator'
import PokemonWiki from './components/Tools/PokemonWiki/PokemonWiki'
import WhosThatPokemon from './components/Tools/WhosThatPokemon/WhosThatPokemon'
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
                    {/* Add routes for other tools here */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
