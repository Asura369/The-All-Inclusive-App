// src/components/TopNavigationBar.js
import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './TopNavigationBar.css'

const TopNavigationBar = ({ user }) => {
    return (
        <Navbar
            bg="primary"
            variant="dark"
            expand="lg"
            className="top-navigation-bar"
        >
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <span className="brand-text">The All-Inclusive App</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="nav-link">
                            Home
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {user && Object.keys(user).length !== 0 ? (
                            <Nav.Link
                                as={Link}
                                to="/LoginPage"
                                className="nav-link user-link"
                            >
                                <i className="bi bi-person-circle"></i> Hi,{' '}
                                {user.name}!
                            </Nav.Link>
                        ) : (
                            <Nav.Link
                                as={Link}
                                to="/LoginPage"
                                className="nav-link login-link"
                            >
                                <i className="bi bi-box-arrow-in-right"></i>{' '}
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default TopNavigationBar
