// src/components/Home.js
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <h1>Welcome to Tools and Utilities App</h1>
            <p>Explore various tools and utilities below:</p>
            <nav>
                <ul>
                    <li>
                        <Link to="/PasswordGenerator">PasswordGenerator</Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Home
