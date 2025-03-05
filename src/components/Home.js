// src/components/Home.js
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Home.css'

const Home = () => {
    // Define app categories
    const appCategories = [
        {
            title: 'Games',
            apps: [
                {
                    name: 'Snake',
                    description: 'Classic snake game with modern features',
                    path: '/Snake',
                    icon: '🐍'
                },
                {
                    name: "Who's That Pokemon",
                    description: 'Test your Pokemon knowledge',
                    path: '/WhosThatPokemon',
                    icon: '❓'
                },
                {
                    name: 'Tic Tac Toe',
                    description: 'Classic game of X and O',
                    path: '/TicTacToe',
                    icon: '🎮'
                }
            ]
        },
        {
            title: 'Utilities',
            apps: [
                {
                    name: 'Password Generator',
                    description: 'Create strong and secure passwords',
                    path: '/PasswordGenerator',
                    icon: '🔒'
                },
                {
                    name: 'QR Code Generator',
                    description: 'Create and download custom QR codes',
                    path: '/QRCodeGenerator',
                    icon: '📱'
                },
                {
                    name: 'Age Calculator',
                    description: 'Calculate your exact age and next birthday',
                    path: '/AgeCalculator',
                    icon: '📅'
                },
                {
                    name: 'Color Picker',
                    description: 'Pick colors from images or color wheel',
                    path: '/ColorPicker',
                    icon: '🎨'
                },
                {
                    name: 'Unit Converter',
                    description:
                        'Convert between different units of measurement',
                    path: '/UnitConverter',
                    icon: '📊'
                },
                {
                    name: 'Data Generator',
                    description:
                        'Generate and mix various types of random data',
                    path: '/DataGenerator',
                    icon: '📋'
                }
            ]
        },
        {
            title: 'Information',
            apps: [
                {
                    name: 'Pokemon Wiki',
                    description: 'Explore Pokemon from each generation',
                    path: '/PokemonWiki',
                    icon: '📚'
                },
                {
                    name: 'To-Do Calendar',
                    description: 'Manage your tasks and schedule',
                    path: 'https://calendar-app-nu-self.vercel.app/',
                    icon: '📆',
                    external: true
                }
            ]
        }
    ]

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="hero-section">
                <Container>
                    <h1 className="hero-title">The All-Inclusive App</h1>
                    <p className="hero-subtitle">
                        Your one-stop collection of useful tools and fun games
                    </p>
                </Container>
            </div>

            {/* Main Content */}
            <Container className="main-content">
                {/* App Categories */}
                {appCategories.map((category, index) => (
                    <div key={index} className="app-category">
                        <h2 className="category-title">{category.title}</h2>
                        <Row>
                            {category.apps.map((app, appIndex) => (
                                <Col
                                    key={appIndex}
                                    lg={4}
                                    md={6}
                                    sm={12}
                                    className="mb-4"
                                >
                                    <Link
                                        to={app.path}
                                        className="app-card"
                                        target={
                                            app.external ? '_blank' : '_self'
                                        }
                                        rel={
                                            app.external
                                                ? 'noopener noreferrer'
                                                : ''
                                        }
                                    >
                                        <div className="app-icon">
                                            {app.icon}
                                        </div>
                                        <div className="app-info">
                                            <h3>{app.name}</h3>
                                            <p>{app.description}</p>
                                        </div>
                                        <div className="app-arrow">→</div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </Container>

            {/* Privacy Notice and Disclaimers */}
            <div className="privacy-section">
                <Container>
                    <h2 className="text-center mb-4">
                        Privacy Notice & Disclaimers
                    </h2>
                    <div className="privacy-content">
                        <div className="privacy-card mb-4">
                            <h3>Data Privacy</h3>
                            <p>
                                <strong>No Data Storage:</strong> The
                                All-Inclusive App is a purely frontend
                                application. We do not collect, store, or
                                process any personal information on our servers.
                            </p>
                            <p>
                                <strong>Local Processing:</strong> All
                                operations are performed locally in your
                                browser. Any data you enter remains on your
                                device and is never transmitted to external
                                servers.
                            </p>
                        </div>

                        <div className="privacy-card mb-4">
                            <h3>Usage Disclaimers</h3>
                            <p>
                                <strong>Educational Purpose:</strong> This
                                application is designed for educational and
                                entertainment purposes only.
                            </p>
                            <p>
                                <strong>No Guarantees:</strong> While we strive
                                for accuracy, we cannot guarantee the precision
                                of all tools and calculations. Do not rely on
                                this application for critical or professional
                                decisions.
                            </p>
                            <p>
                                <strong>Third-Party Content:</strong> Some
                                applications may access public APIs or display
                                third-party content. We are not responsible for
                                the accuracy or availability of such content.
                            </p>
                        </div>

                        <div className="privacy-card">
                            <h3>Security Notice</h3>
                            <p>
                                <strong>Browser Storage:</strong> Some
                                applications may use browser storage mechanisms
                                (localStorage or sessionStorage) to enhance your
                                experience. This data remains on your device and
                                is not accessible to us.
                            </p>
                            <p>
                                <strong>External Links:</strong> This
                                application may contain links to external
                                websites. We are not responsible for the privacy
                                practices or content of these external sites.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Footer */}
            <footer className="home-footer">
                <Container>
                    <p>
                        © 2023-2025 The All-Inclusive App. All rights reserved.
                        All apps are designed for educational and entertainment
                        purposes.
                    </p>
                    <p className="small text-muted mt-2">
                        Built with{' '}
                        <a
                            href="https://react-bootstrap.github.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            React Bootstrap
                        </a>{' '}
                        and{' '}
                        <a
                            href="https://react-icons.github.io/react-icons/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            React Icons
                        </a>
                        .
                    </p>
                </Container>
            </footer>
        </div>
    )
}

export default Home
