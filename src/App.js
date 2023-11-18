// src/App.js
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Home from './components/Home'
import TopNavigationBar from './components/TopNavigationBar'
import PasswordGenerator from './components/Tools/PasswordGenerator/PasswordGenerator'
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
                    {/* Add routes for other tools here */}
                </Routes>
            </div>
        </Router>
    )
}

export default App
