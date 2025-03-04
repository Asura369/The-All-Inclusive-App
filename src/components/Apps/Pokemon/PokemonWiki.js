// src/components/Apps/Pokemon/PokemonWiki.js
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Badge,
    Form
} from 'react-bootstrap'
import { FaGamepad, FaSearch, FaInfoCircle } from 'react-icons/fa'
import './PokemonWiki.css'

// Cache for storing API responses
const apiCache = {}

const PokemonWiki = () => {
    const [pokemonList, setPokemonList] = useState([]) // Store the list of Pokemon
    const [activeGeneration, setActiveGeneration] = useState(null) // Store the active Pokemon generation
    const [loading, setLoading] = useState(false) // Loading state
    const [searchTerm, setSearchTerm] = useState('') // Search term
    const [filteredList, setFilteredList] = useState([]) // Filtered Pokemon list

    // Pokemon generation range dictionary
    const generation_dict = {
        1: { range: [0, 151], name: 'Kanto' },
        2: { range: [151, 251], name: 'Johto' },
        3: { range: [251, 386], name: 'Hoenn' },
        4: { range: [386, 493], name: 'Sinnoh' },
        5: { range: [493, 649], name: 'Unova' },
        6: { range: [649, 721], name: 'Kalos' },
        7: { range: [721, 809], name: 'Alola' },
        8: { range: [809, 905], name: 'Galar' }
    }

    // Effect to filter Pokemon based on search term
    useEffect(() => {
        if (pokemonList.length > 0) {
            const filtered = pokemonList.filter(
                (pokemon) =>
                    pokemon.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    getPokemonIdFromUrl(pokemon.url)
                        .toString()
                        .includes(searchTerm)
            )
            setFilteredList(filtered)
        }
    }, [searchTerm, pokemonList])

    // Fetch Pokemon list based on the selected generation
    const fetchPokemonList = async (generation) => {
        setLoading(true)
        setSearchTerm('') // Clear search when changing generation

        const [offset_value, limit_value] = [
            generation_dict[generation].range[0],
            generation_dict[generation].range[1] -
                generation_dict[generation].range[0]
        ]

        // Create a cache key for this specific request
        const cacheKey = `pokemon_gen_${generation}`

        try {
            // Check if we have cached data for this generation
            if (apiCache[cacheKey]) {
                console.log('Using cached data for generation', generation)
                setPokemonList(apiCache[cacheKey])
                setFilteredList(apiCache[cacheKey])
                setActiveGeneration(generation)
            } else {
                // If not in cache, fetch from API
                const response = await fetch(
                    `https://pokeapi.co/api/v2/pokemon?limit=${limit_value}&offset=${offset_value}`
                )
                const data = await response.json()
                const data_list = data.results

                // Store in cache
                apiCache[cacheKey] = data_list

                setPokemonList(data_list)
                setFilteredList(data_list)
                setActiveGeneration(generation)
            }
        } catch (error) {
            console.error('Error fetching Pokemon data:', error)
        } finally {
            setLoading(false)
        }
    }

    // Extract Pokemon ID from the URL
    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    // Format Pokemon name to be capitalized and remove hyphens
    function formatPokemonName(name) {
        return name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // JSX rendering
    return (
        <Container className="pokemon-wiki-container">
            <div className="pokemon-header">
                <h1 className="pokemon-title">Pokémon Encyclopedia</h1>
                <p className="pokemon-subtitle">
                    Explore Pokémon from all generations
                </p>

                <Link to="/WhosThatPokemon" className="game-link">
                    <FaGamepad className="game-icon" /> Play Who's That Pokémon?
                </Link>
            </div>

            <div className="generation-selector">
                <h4 className="selector-title">Select a Region</h4>
                <div className="generation-buttons">
                    {Object.keys(generation_dict).map((generation) => (
                        <Button
                            key={generation}
                            variant={
                                activeGeneration === parseInt(generation)
                                    ? 'primary'
                                    : 'outline-primary'
                            }
                            className="generation-button"
                            onClick={() =>
                                fetchPokemonList(parseInt(generation))
                            }
                        >
                            Gen {generation}: {generation_dict[generation].name}
                        </Button>
                    ))}
                </div>
            </div>

            {activeGeneration && (
                <div className="pokemon-content">
                    <div className="search-container">
                        <Form.Group className="mb-3">
                            <div className="search-input-wrapper">
                                <FaSearch className="search-icon" />
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name or number..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                            </div>
                        </Form.Group>
                        <div className="results-info">
                            <Badge bg="info">
                                <FaInfoCircle /> Showing {filteredList.length}{' '}
                                Pokémon from Generation {activeGeneration}
                            </Badge>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <Spinner
                                animation="border"
                                role="status"
                                variant="primary"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                            <p>Loading Pokémon data...</p>
                        </div>
                    ) : (
                        <>
                            <Row className="pokemon-grid">
                                {filteredList.map((pokemon) => {
                                    const pokemonId = getPokemonIdFromUrl(
                                        pokemon.url
                                    )
                                    return (
                                        <Col
                                            key={pokemon.name}
                                            xs={6}
                                            sm={6}
                                            md={4}
                                            lg={3}
                                            className="mb-4"
                                        >
                                            <Card className="pokemon-card">
                                                <div className="pokemon-id-badge">
                                                    #{pokemonId}
                                                </div>
                                                <div className="pokemon-image-container">
                                                    <Card.Img
                                                        variant="top"
                                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
                                                        alt={pokemon.name}
                                                        className="pokemon-image"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <Card.Body>
                                                    <Card.Title className="pokemon-name">
                                                        {formatPokemonName(
                                                            pokemon.name
                                                        )}
                                                    </Card.Title>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row>

                            {filteredList.length === 0 && (
                                <div className="no-results">
                                    <p>
                                        No Pokémon found matching "{searchTerm}"
                                    </p>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {!activeGeneration && !loading && (
                <div className="welcome-message">
                    <h2>Welcome to the Pokémon Encyclopedia!</h2>
                    <p>Select a generation above to start exploring Pokémon.</p>
                    <img
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                        alt="Pikachu"
                        className="welcome-image"
                    />
                </div>
            )}

            <div className="api-attribution">
                <p>
                    Pokémon data provided by{' '}
                    <a
                        href="https://pokeapi.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        PokéAPI
                    </a>
                </p>
                <p>
                    Pokémon images and artwork © Nintendo, Game Freak, and The
                    Pokémon Company.
                </p>
                <p>
                    Pokémon and Pokémon character names are trademarks of
                    Nintendo.
                </p>
                <p className="small">
                    This is an unofficial, fan-made application for educational
                    purposes only.
                </p>
            </div>
        </Container>
    )
}

export default PokemonWiki
