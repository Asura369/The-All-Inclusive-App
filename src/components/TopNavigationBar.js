// src/components/TopNavigationBar.js
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './TopNavigationBar.css'

const TopNavigationBar = ({ user }) => {
    return (
        <Navbar bg="primary" variant="light" className="top-navigation-bar">
            <Navbar.Brand href="/">Tools & Utilities</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link as={Link} to="/">
                    Home
                </Nav.Link>
            </Nav>
            <Nav className="justify-content-end max-width">
                {/* Conditionally render user's name or Login link */}
                {user && Object.keys(user).length !== 0 ? (
                    <Nav.Link as={Link} to="/LoginPage">
                        Hi {user.name}!
                    </Nav.Link>
                ) : (
                    <Nav.Link as={Link} to="/LoginPage">
                        Login
                    </Nav.Link>
                )}
            </Nav>
        </Navbar>
    )
}

export default TopNavigationBar
