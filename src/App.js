// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './components/Home'
import TopNavigationBar from './components/TopNavigationBar'
import PasswordGenerator from './components/Apps/PasswordGenerator/PasswordGenerator'
import PokemonWiki from './components/Apps/Pokemon/PokemonWiki'
import WhosThatPokemon from './components/Apps/Pokemon/WhosThatPokemon'
import SnakeGame from './components/Apps/SnakeGame/SnakeGame'
import QRCodeGenerator from './components/Apps/QRCodeGenerator/QRCodeGenerator'
import AgeCalculator from './components/Apps/AgeCalculator/AgeCalculator'
import ColorPicker from './components/Apps/ColorPicker/ColorPicker'

function App() {
    return (
        <Router>
            <div>
                <TopNavigationBar />
                <Routes>
                    <Route path="/" element={<Home />} />
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
                    <Route
                        path="/QRCodeGenerator"
                        element={<QRCodeGenerator />}
                    />
                    <Route path="/AgeCalculator" element={<AgeCalculator />} />
                    <Route path="/ColorPicker" element={<ColorPicker />} />
                    {/* Add routes for other Apps here */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
