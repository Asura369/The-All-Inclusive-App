// src/components/TopNavigationBar.js
import React from 'react'
import { Link } from 'react-router-dom'

const TopNavigationBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
        </nav>
    )
}

export default TopNavigationBar
