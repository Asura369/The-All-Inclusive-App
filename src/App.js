// src/App.js
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './components/Home'
import TopNavigationBar from './components/TopNavigationBar'
import PasswordGenerator from './components/Tools/PasswordGenerator'

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
                    {/* Add routes for other tools here */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
