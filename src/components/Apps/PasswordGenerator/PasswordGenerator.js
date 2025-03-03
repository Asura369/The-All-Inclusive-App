// src/components/Apps/PasswordGenerator/PasswordGenerator.js
import React, { useState, useEffect } from 'react'
import { FaCopy, FaRedo, FaCheck } from 'react-icons/fa'
import './PasswordGenerator.css'

const PasswordGenerator = () => {
    const [generatedPassword, setGeneratedPassword] = useState('')
    const [copied, setCopied] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        label: '',
        color: ''
    })

    // State for password options
    const [options, setOptions] = useState({
        lowercase: true,
        uppercase: true,
        numbers: true,
        specialChars: false,
        excludeSimilar: false
    })

    // State for password length; default length 16
    const [passwordLength, setPasswordLength] = useState(16)

    // Character options for each option type
    const charsetOptions = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        specialChars: '!@#$%^&*()_-+=<>?/~[]{}|'
    }

    // Similar characters to exclude if that option is selected
    const similarChars = 'il1Lo0O'

    // Function to calculate password strength
    const calculatePasswordStrength = (password) => {
        if (!password) return { score: 0, label: '', color: '' }

        let score = 0

        // Length check
        if (password.length >= 12) score += 2
        else if (password.length >= 8) score += 1

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1
        if (/[A-Z]/.test(password)) score += 1
        if (/[0-9]/.test(password)) score += 1
        if (/[^a-zA-Z0-9]/.test(password)) score += 1

        // Determine strength label and color
        let label, color
        if (score >= 5) {
            label = 'Strong'
            color = '#28a745' // green
        } else if (score >= 3) {
            label = 'Medium'
            color = '#ffc107' // yellow
        } else {
            label = 'Weak'
            color = '#dc3545' // red
        }

        return { score, label, color }
    }

    // Function to generate a password based on selected options
    const generatePassword = () => {
        // Create a string of characters based on selected options
        let selectedCharset = Object.keys(options)
            .filter((option) => options[option] && option !== 'excludeSimilar')
            .map((option) => charsetOptions[option])
            .join('')

        // Remove similar characters if that option is selected
        if (options.excludeSimilar) {
            selectedCharset = selectedCharset
                .split('')
                .filter((char) => !similarChars.includes(char))
                .join('')
        }

        // Ensure we have at least one character to work with
        if (selectedCharset.length === 0) {
            setGeneratedPassword('')
            return
        }

        // Initialize an empty string to store the generated password
        let password = ''

        // Generate the password by randomly selecting characters from the selectedCharset
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(
                Math.random() * selectedCharset.length
            )
            password += selectedCharset[randomIndex]
        }

        // Set the generated password in the component's state
        setGeneratedPassword(password)
    }

    // Generate a password on initial render
    useEffect(() => {
        generatePassword()
        // eslint-disable-next-line
    }, [])

    // Update password strength whenever the password changes
    useEffect(() => {
        setPasswordStrength(calculatePasswordStrength(generatedPassword))
    }, [generatedPassword])

    // Function to toggle options
    const handleOptionToggle = (option) => {
        // Check the number of selected options (excluding excludeSimilar)
        const numSelectedOptions = Object.entries(options).filter(
            ([key, value]) => key !== 'excludeSimilar' && value
        ).length

        // If only one option is selected, do not allow unselecting
        if (
            numSelectedOptions === 1 &&
            options[option] &&
            option !== 'excludeSimilar'
        ) {
            return
        }

        // Update the options state
        setOptions((prevOptions) => ({
            ...prevOptions,
            [option]: !prevOptions[option]
        }))
    }

    // Maximum allowed password length
    const MAX_PASSWORD_LENGTH = 100

    // Function to handle changes in password length input
    const handlePasswordLengthChange = (event) => {
        let length = parseInt(event.target.value, 10)

        // Ensure the entered length is within a valid range
        length = isNaN(length)
            ? 8
            : Math.min(MAX_PASSWORD_LENGTH, Math.max(8, length))

        // Set the validated password length in the component state
        setPasswordLength(length)
    }

    // Function to handle slider change
    const handleSliderChange = (event) => {
        setPasswordLength(parseInt(event.target.value, 10))
    }

    // Function to copy password to clipboard
    const copyToClipboard = () => {
        if (!generatedPassword) return

        navigator.clipboard
            .writeText(generatedPassword)
            .then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err)
            })
    }

    return (
        <div className="password-generator-container">
            <h2>Password Generator</h2>

            <div className="password-display">
                <div className="password-field">
                    <input
                        type="text"
                        value={generatedPassword}
                        readOnly
                        className="password-output"
                    />
                    <div className="password-actions">
                        <button
                            className="icon-button"
                            onClick={copyToClipboard}
                            title="Copy to clipboard"
                        >
                            {copied ? <FaCheck /> : <FaCopy />}
                        </button>
                        <button
                            className="icon-button"
                            onClick={generatePassword}
                            title="Generate new password"
                        >
                            <FaRedo />
                        </button>
                    </div>
                </div>

                <div className="strength-meter">
                    <div className="strength-label">
                        Strength: {passwordStrength.label}
                    </div>
                    <div className="strength-bar">
                        <div
                            className="strength-indicator"
                            style={{
                                width: `${(passwordStrength.score / 6) * 100}%`,
                                backgroundColor: passwordStrength.color
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="password-options">
                <div className="length-section">
                    <label htmlFor="passwordLength">
                        Length: {passwordLength}
                    </label>
                    <div className="slider-container">
                        <input
                            type="range"
                            id="passwordLength"
                            min="8"
                            max={MAX_PASSWORD_LENGTH}
                            value={passwordLength}
                            onChange={handleSliderChange}
                            className="length-slider"
                        />
                        <input
                            type="number"
                            min="8"
                            max={MAX_PASSWORD_LENGTH}
                            value={passwordLength}
                            onChange={handlePasswordLengthChange}
                            className="length-input"
                        />
                    </div>
                </div>

                <div className="character-options">
                    <h3>Character Types</h3>
                    <div className="options-grid">
                        <div className="option-item">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={options.lowercase}
                                    onChange={() =>
                                        handleOptionToggle('lowercase')
                                    }
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-label">
                                    Lowercase (a-z)
                                </span>
                            </label>
                        </div>

                        <div className="option-item">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={options.uppercase}
                                    onChange={() =>
                                        handleOptionToggle('uppercase')
                                    }
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-label">
                                    Uppercase (A-Z)
                                </span>
                            </label>
                        </div>

                        <div className="option-item">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={options.numbers}
                                    onChange={() =>
                                        handleOptionToggle('numbers')
                                    }
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-label">
                                    Numbers (0-9)
                                </span>
                            </label>
                        </div>

                        <div className="option-item">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={options.specialChars}
                                    onChange={() =>
                                        handleOptionToggle('specialChars')
                                    }
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-label">
                                    Special Characters (!@#$%)
                                </span>
                            </label>
                        </div>

                        <div className="option-item">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={options.excludeSimilar}
                                    onChange={() =>
                                        handleOptionToggle('excludeSimilar')
                                    }
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-label">
                                    Exclude Similar Characters (i, l, 1, L, o,
                                    0, O)
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <button className="generate-button" onClick={generatePassword}>
                Generate New Password
            </button>

            <div className="password-tips">
                <h3>Password Tips</h3>
                <ul>
                    <li>Use at least 12 characters for strong security</li>
                    <li>Include a mix of letters, numbers, and symbols</li>
                    <li>Avoid using personal information</li>
                    <li>Use a different password for each account</li>
                </ul>
            </div>
        </div>
    )
}

export default PasswordGenerator
