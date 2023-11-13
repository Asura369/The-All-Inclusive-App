// src/components/TopNavigationBar.js
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import './TopNavigationBar.css'

const TopNavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" className="top-navigation-bar">
            <Navbar.Brand href="/">Tools & Utilities</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
            </Nav>
        </Navbar>
    )
}

export default TopNavigationBar
