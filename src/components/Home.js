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
