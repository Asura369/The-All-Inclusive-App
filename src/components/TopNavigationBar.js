// src/components/TopNavigationBar.js
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Navbar, Nav } from 'react-bootstrap'
import './TopNavigationBar.css'

const TopNavigationBar = () => {
    const [user, setUser] = useState({})

    function handleCallbackResponse(response) {
        console.log('Enconded JWT ID Token: ', response.credential)
        var userObject = jwtDecode(response.credential)
        console.log('Decoded JWT Token:', userObject)
        setUser(userObject)
        document.getElementById('signInDiv').hidden = true
    }

    function handleSignOut(event) {
        setUser({})
        document.getElementById('signInDiv').hidden = false
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id:
                '701460506777-vtkbrv2li5frjo3l4th44mfoai1g2mth.apps.googleusercontent.com',
            callback: handleCallbackResponse
        })

        google.accounts.id.renderButton(document.getElementById('signInDiv'), {
            theme: 'outline',
            size: 'large'
        })

        google.accounts.id.prompt()
    }, [])

    return (
        <Navbar bg="dark" variant="dark" className="top-navigation-bar">
            <Navbar.Brand href="/">Tools & Utilities</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
            </Nav>
            <Nav className="justify-content-end google-button">
                <Nav.Link id="signInDiv"></Nav.Link>
                {Object.keys(user).length !== 0 && (
                    <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
                )}
                <Nav.Link id="signInDiv"></Nav.Link>
                {user && (
                    <div>
                        <h3>{user.name}</h3>
                    </div>
                )}
            </Nav>
        </Navbar>
    )
}

export default TopNavigationBar
