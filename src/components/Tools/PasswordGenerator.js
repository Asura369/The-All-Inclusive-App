// src/components/Tools/PasswordGenerator.js
import React, { useState } from 'react'
import './PasswordGenerator.css' // Import the CSS file for styling

const PasswordGenerator = () => {
    const [generatedPassword, setGeneratedPassword] = useState('')

    // State for password options
    const [options, setOptions] = useState({
        lowercase: true,
        uppercase: true,
        numbers: true,
        specialChars: false
    })

    // State for password length; default length 18
    const [passwordLength, setPasswordLength] = useState(18)

    // Character options for each option type
    const charsetOptions = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        specialChars: '!@#$%^&*()_-+=<>?/'
    }

    // Function to generate a password based on selected options
    const generatePassword = () => {
        // Create a string of characters based on selected options
        const selectedCharset = Object.keys(options) // Get an array of the keys in the options object
            .filter((option) => options[option]) // Filter out the options that are set to true
            .map((option) => charsetOptions[option]) // Map each selected option to its corresponding character set from charsetOptions
            .join('') // Join the selected character sets into a single string

        // Initialize an empty string to store the generated password
        let password = ''

        // Generate the password by randomly selecting characters from the selectedCharset
        for (let i = 0; i < passwordLength; i++) {
            // Generate a random index within the length of selectedCharset
            const randomIndex = Math.floor(
                Math.random() * selectedCharset.length
            )
            // Append the randomly selected character to the password
            password += selectedCharset[randomIndex]
        }

        // Set the generated password in the component's state
        setGeneratedPassword(password)
    }

    // Function to toggle options (lowercase, uppercase, numbers, special characters)
    const handleOptionToggle = (option) => {
        // Check the number of selected options
        const numSelectedOptions = Object.values(options).filter(Boolean).length

        // If only one option is selected, do not allow unselecting
        if (numSelectedOptions === 1 && options[option]) {
            return
        }

        // Update the options state
        setOptions((prevOptions) => ({
            ...prevOptions,
            [option]: !prevOptions[option]
        }))
    }

    // Maximum allowed password length
    const MAX_PASSWORD_LENGTH = 365

    // Function to handle changes in password length input
    const handlePasswordLengthChange = (event) => {
        let length = parseInt(event.target.value, 10)

        // Ensure the entered length is within a valid range
        length = isNaN(length)
            ? 1
            : Math.min(MAX_PASSWORD_LENGTH, Math.max(1, length))

        // Set the validated password length in the component state
        setPasswordLength(length)
    }

    return (
        <div className="password-generator-container">
            <h2>Password Generator Tool</h2>
            <div>
                {/* Input for password length */}
                <label htmlFor="passwordLength">Password Length: </label>
                <input
                    type="number"
                    id="passwordLength"
                    min="1"
                    max={MAX_PASSWORD_LENGTH}
                    className="password-length-input"
                    value={passwordLength}
                    onChange={handlePasswordLengthChange}
                />
            </div>
            <br />
            <div className="options">
                {/* Buttons to toggle character options */}
                <button
                    className={options.lowercase ? 'selected' : ''}
                    onClick={() => handleOptionToggle('lowercase')}
                >
                    Lowercase Letters
                </button>
                <button
                    className={options.uppercase ? 'selected' : ''}
                    onClick={() => handleOptionToggle('uppercase')}
                >
                    Uppercase Letters
                </button>
                <button
                    className={options.numbers ? 'selected' : ''}
                    onClick={() => handleOptionToggle('numbers')}
                >
                    Numbers
                </button>
                <button
                    className={options.specialChars ? 'selected' : ''}
                    onClick={() => handleOptionToggle('specialChars')}
                >
                    Special Characters
                </button>
            </div>

            <br />

            {/* Button to generate password */}
            <button className="generate-button" onClick={generatePassword}>
                Generate Password
            </button>
            <div className="password-display">
                {/* Display generated password */}
                {generatedPassword && (
                    <div>
                        <h3>Generated Password:</h3>
                        <p className="generated-password">
                            {generatedPassword}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PasswordGenerator
