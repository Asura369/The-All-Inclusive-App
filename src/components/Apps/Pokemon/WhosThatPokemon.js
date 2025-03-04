// src/components/Apps/Pokemon/WhosThatPokemon.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './WhosThatPokemon.css'
// Background image based on the "Who's That Pokémon?" segment from the Pokémon anime
// © Nintendo, Game Freak, and The Pokémon Company
import BackgroundImage from './Background.webp'

// Cache for storing API responses
const apiCache = {}

const WhosThatPokemon = () => {
    const [pokemonList, setPokemonList] = useState([]) // List of Pokemon for the current generation
    const [activeGeneration, setActiveGeneration] = useState() // Active Pokemon generation
    const [playGame, setPlayGame] = useState(false) // Flag to control the game visibility
    const [start, setStart] = useState(false) // Flag to track the start of each round
    const [mysteryPokemon, setMysteryPokemon] = useState('') // Name of the mystery Pokemon
    const [mysteryPokemonSrc, setMysteryPokemonSrc] = useState('') // Source URL of the mystery Pokemon image
    const [answerChoices, setAnswerChoices] = useState([]) // List of answer choices for each round
    const [showOverlay, setShowOverlay] = useState(false) // Flag to control the overlay visibility
    const [answerCorrect, setAnswerCorrect] = useState(false) // Flag to track if the user's answer is correct

    // Dictionary to map Pokemon generations to their range in the Pokedex
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

    // Fetches the list of Pokemon for the specified generation from the PokeAPI
    const fetchPokemonList = async (generation) => {
        resetGameStates() // Reset game-related states before fetching a new generation

        // Variables to control the range of fetching from the PokeAPI
        const limit_value =
            generation_dict[generation].range[1] -
            generation_dict[generation].range[0]
        const offset_value = generation_dict[generation].range[0]

        // Create a cache key for this specific request
        const cacheKey = `pokemon_gen_${generation}`

        // Try fetching from the PokeAPI and storing the data
        try {
            // Check if we have cached data for this generation
            if (apiCache[cacheKey]) {
                console.log('Using cached data for generation', generation)
                setPokemonList(apiCache[cacheKey])
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
                setActiveGeneration(generation)
            }
        } catch (error) {
            console.error('Error fetching Pokemon data:', error)
        }
    }

    // Resets game-related states
    const resetGameStates = () => {
        setAnswerCorrect(false)
        setShowOverlay(false)
        setMysteryPokemonSrc('')
        setMysteryPokemon('')
        setAnswerChoices([])
        setStart(false)
    }

    // Toggles the playGame state when the "Play Game" button is clicked
    const handlePlayGame = () => {
        setPlayGame(!playGame)
    }

    // Extracts the Pokemon ID from its URL
    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    // Starts a new game round
    const startGame = () => {
        generateRandomPokemon()
        setStart(true)
    }

    // Generates a new mystery Pokemon and answer choices for the current round
    const generateRandomPokemon = () => {
        if (pokemonList.length === 0) return

        let randomIndex = Math.floor(Math.random() * pokemonList.length)
        let randomPokemon = pokemonList[randomIndex]
        const pokemonId = getPokemonIdFromUrl(randomPokemon.url)
        const mysteryPokemonUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

        const choiceList = [] // Array to store the mystery pokemon and three other random pokemon name
        choiceList.push(randomPokemon.name)
        setMysteryPokemon(randomPokemon.name)
        setMysteryPokemonSrc(mysteryPokemonUrl)

        for (let i = 1; i <= 3; i++) {
            // Use do while + include to ensure no duplicates
            do {
                randomIndex = Math.floor(Math.random() * pokemonList.length)
                randomPokemon = pokemonList[randomIndex]
            } while (choiceList.includes(randomPokemon.name))
            choiceList.push(randomPokemon.name)
        }

        // Fisher Yates Shuffle to randomize the answer choices
        for (let i = choiceList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let k = choiceList[i]
            choiceList[i] = choiceList[j]
            choiceList[j] = k
        }

        // Set the answer choices after shuffling
        setAnswerChoices(choiceList)
    }

    // Checks the user's answer and updates game states accordingly
    const checkAnswer = (pokemonName) => {
        setShowOverlay(true)
        if (pokemonName === mysteryPokemon) {
            setAnswerCorrect(true)

            // Delay before starting a new round on correct answer
            setTimeout(() => {
                generateRandomPokemon()
                setShowOverlay(false)
            }, 1500)
        } else {
            setAnswerCorrect(false)

            // Delay before starting a new round on incorrect answer
            setTimeout(() => {
                generateRandomPokemon()
                setShowOverlay(false)
            }, 1500)
        }
    }

    return (
        <div className="whos-that-pokemon-container">
            <h3>Who's That Pokémon?</h3>

            {playGame === false ? (
                <div>
                    {/* Link to PokemonWiki */}
                    <Link to="/PokemonWiki" className="go-to-game">
                        See Pokémon List
                    </Link>

                    {/* Button to start the game */}
                    <button className="go-to-game" onClick={handlePlayGame}>
                        Play Game
                    </button>
                </div>
            ) : (
                <div>
                    {/* Buttons to select Pokemon generations */}
                    <div className="generation-buttons">
                        {Object.keys(generation_dict).map((generation) => (
                            <button
                                key={generation}
                                className={
                                    parseInt(generation) === activeGeneration
                                        ? 'active'
                                        : ''
                                }
                                onClick={() =>
                                    fetchPokemonList(parseInt(generation))
                                }
                            >
                                Gen {generation}:{' '}
                                {generation_dict[generation].name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Display game screen when a valid Pokemon generation is selected */}
            {activeGeneration >= 1 && activeGeneration <= 8 ? (
                <div className="whos-that-pokemon-container">
                    {/* Main game screen */}
                    <div
                        className={`game-screen ${showOverlay ? 'active' : ''}`}
                    >
                        <div className="image-section">
                            {/* Background image */}
                            <img
                                src={BackgroundImage}
                                alt="Background"
                                className="background-image"
                            />

                            {/* Mystery Pokemon image - only show if game has started */}
                            {mysteryPokemonSrc && (
                                <img
                                    src={mysteryPokemonSrc}
                                    alt="Mystery Pokémon"
                                    className={
                                        start
                                            ? 'mystery-pokemon-image active'
                                            : 'mystery-pokemon-image'
                                    }
                                />
                            )}

                            {/* Button to start the game */}
                            <button
                                className={
                                    start === true
                                        ? 'start-game active'
                                        : 'start-game'
                                }
                                onClick={startGame}
                            >
                                Start Game
                            </button>
                        </div>

                        {/* Answer choices - only show if game has started */}
                        {start && (
                            <div className="choices">
                                {answerChoices.map((pokemonName) => (
                                    <button
                                        className="pokemon-name"
                                        key={pokemonName}
                                        onClick={() => checkAnswer(pokemonName)}
                                    >
                                        {pokemonName}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Overlay for correct/incorrect answer feedback */}
                        <div className="overlay"></div>

                        {/* Popup for correct/incorrect answer feedback */}
                        {answerCorrect === true ? (
                            <div className="popup">
                                <h3 className="pokemon-name correct">
                                    Hooray, It's {mysteryPokemon}!
                                </h3>
                                <img
                                    src={mysteryPokemonSrc}
                                    alt="Mystery Pokémon"
                                    className={'mystery-pokemon-image shown'}
                                />
                            </div>
                        ) : (
                            <div className="popup">
                                <h3 className="pokemon-name incorrect">
                                    Errrrr, It's {mysteryPokemon}!
                                </h3>
                                <img
                                    src={mysteryPokemonSrc}
                                    alt="Mystery Pokémon"
                                    className={'mystery-pokemon-image shown'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ) : null}

            {playGame && (
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
                        Pokémon images and artwork © Nintendo, Game Freak, and
                        The Pokémon Company.
                    </p>
                    <p>
                        "Who's That Pokémon?" format is based on the segment
                        from the Pokémon anime series.
                    </p>
                    <p>
                        Pokémon and Pokémon character names are trademarks of
                        Nintendo.
                    </p>
                    <p className="small">
                        This is an unofficial, fan-made application for
                        educational purposes only.
                    </p>
                </div>
            )}
        </div>
    )
}

export default WhosThatPokemon
