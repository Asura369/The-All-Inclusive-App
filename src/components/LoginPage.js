// src/components/LoginPage.js
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const LoginPage = ({ setUser }) => {
    const [user, setLocalUser] = useState({})
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    console.log('User: ', user)

    // Callback function to handle the response after the user signs in with google
    function handleCallbackResponse(response) {
        console.log('Encoded JWT ID Token: ', response.credential)

        // Decode the JWT token to extract user information
        const userObject = jwtDecode(response.credential)
        console.log('Decoded JWT Token:', userObject)

        // Set the user information in the component state
        setLocalUser(userObject)
        setUser(userObject)

        // Hide the sign-in button
        document.getElementById('googleSignInDiv').hidden = true
    }

    // Callback function to handle user sign-out
    function handleSignOut(event) {
        // Clear user information from the component state
        setLocalUser({})
        setUser({})

        // Show the sign-in button
        document.getElementById('googleSignInDiv').hidden = false
    }

    // useEffect hook to initialize Google Sign-In
    useEffect(() => {
        /* global google */

        // Initialize Google Sign-In with the client ID
        google.accounts.id.initialize({
            client_id:
                '701460506777-vtkbrv2li5frjo3l4th44mfoai1g2mth.apps.googleusercontent.com',
            callback: handleCallbackResponse
        })

        // Render the sign-in button with the specified theme and size
        google.accounts.id.renderButton(
            document.getElementById('googleSignInDiv'),
            {
                theme: 'outline',
                size: 'large'
            }
        )

        // Prompt the user to sign in with a previous account at start
        // google.accounts.id.prompt();
    }, [])

    // Handle form submission for regular login
    const handleRegularLogin = (e) => {
        e.preventDefault()
        // Set the user information in the component state
        setLocalUser({ name: username })
        setUser({ name: username })
        // Clear form fields
        setUsername('')
        setPassword('')

        // Hide google sign-in button
        document.getElementById('googleSignInDiv').hidden = true
    }

    return (
        <div>
            <div id="googleSignInDiv"></div>
            {Object.keys(user).length !== 0 ? (
                <div>
                    <button onClick={handleSignOut}>Sign Out</button>
                    <div>
                        <h3>{user.name}</h3>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Regular Login Form */}
                    <form onSubmit={handleRegularLogin}>
                        <label>
                            Username:
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button type="submit">Login</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default LoginPage
