// src/components/Tools/Pokemon/WhosThatPokemon.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Pokemon.css'
import BackgroundImage from './Background.webp'

const WhosThatPokemon = () => {
    const [pokemonList, setPokemonList] = useState([])
    const [activeGeneration, setActiveGeneration] = useState()
    const [playGame, setPlayGame] = useState(false)
    const [start, setStart] = useState(false)
    const [mysteryPokemon, setMysteryPokemon] = useState('')
    const [mysteryPokemonSrc, setMysteryPokemonSrc] = useState('')
    const [answerChoices, setAnswerChoices] = useState([])
    const [showOverlay, setShowOverlay] = useState(false)
    const [answerCorrect, setAnswerCorrect] = useState(false)

    const generation_dict = {
        1: [0, 151],
        2: [151, 251],
        3: [251, 386],
        4: [386, 493],
        5: [493, 649],
        6: [649, 721],
        7: [721, 809],
        8: [809, 905]
    }

    const fetchPokemonList = async (generation) => {
        resetGameStates()
        const limit_value =
            generation_dict[generation][1] - generation_dict[generation][0]
        const offset_value = generation_dict[generation][0]
        try {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon?limit=${limit_value}&offset=${offset_value}`
            )
            const data = await response.json()
            const data_list = data.results
            setPokemonList(data_list)
            setActiveGeneration(generation)
        } catch (error) {
            console.error('Error fetching Pokemon data:', error)
        }
    }

    const resetGameStates = () => {
        setAnswerCorrect(false)
        setShowOverlay(false)
        setMysteryPokemonSrc('')
        setMysteryPokemon('')
        setAnswerChoices([])
        setStart(false)
    }

    const handlePlayGame = () => {
        setPlayGame(!playGame)
    }

    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    const startGame = () => {
        generateRandomPokemon()
        setStart(!start)
    }

    const generateRandomPokemon = () => {
        let randomIndex = Math.floor(Math.random() * pokemonList.length)
        let randomPokemon = pokemonList[randomIndex]
        const mysteryPokemonUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(
            randomPokemon.url
        )}.png`

        const choiceList = []
        choiceList.push(randomPokemon.name)
        setMysteryPokemon(randomPokemon.name)
        setMysteryPokemonSrc(mysteryPokemonUrl)

        for (let i = 1; i <= 3; i++) {
            do {
                randomIndex = Math.floor(Math.random() * pokemonList.length)
                randomPokemon = pokemonList[randomIndex]
            } while (choiceList.includes(randomPokemon.name))
            choiceList.push(randomPokemon.name)
        }

        //Fisher Yates Shuffle
        for (let i = choiceList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let k = choiceList[i]
            choiceList[i] = choiceList[j]
            choiceList[j] = k
        }

        setAnswerChoices(choiceList)
    }

    const checkAnswer = (pokemonName) => {
        setShowOverlay(true)
        if (pokemonName === mysteryPokemon) {
            setAnswerCorrect(true)

            setTimeout(() => {
                generateRandomPokemon()
                setShowOverlay(false)
            }, 1500)
        } else {
            setAnswerCorrect(false)

            setTimeout(() => {
                generateRandomPokemon()
                setShowOverlay(false)
            }, 1500)
        }
    }

    return (
        <div className="whos-that-pokemon-container">
            <h3>Whos That Pokemon</h3>
            {playGame === false ? (
                <div>
                    <Link to="/PokemonWiki" className="go-to-game">
                        See Pokemon List
                    </Link>
                    <button className="go-to-game" onClick={handlePlayGame}>
                        Play Game
                    </button>
                </div>
            ) : (
                <div>
                    <div className="generation-buttons">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((generation) => (
                            <button
                                key={generation}
                                className={
                                    generation === activeGeneration
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => fetchPokemonList(generation)}
                            >
                                Generation {generation}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeGeneration >= 1 && activeGeneration <= 8 ? (
                <div className="whos-that-pokemon-container">
                    <div
                        className={`game-screen ${showOverlay ? 'active' : ''}`}
                    >
                        <div className="image-section">
                            <img
                                src={BackgroundImage}
                                alt="Background"
                                className="background-image"
                            />
                            <img
                                src={mysteryPokemonSrc}
                                alt="mystery-pokemon"
                                className={
                                    start
                                        ? 'mystery-pokemon-image active'
                                        : 'mystery-pokemon-image'
                                }
                            />
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
                        <div className="overlay"></div>
                        {answerCorrect === true ? (
                            <div className="popup">
                                <h3 className="pokemon-name correct">
                                    Hooray, It's {mysteryPokemon}!
                                </h3>
                                <img
                                    src={mysteryPokemonSrc}
                                    alt="mystery-pokemon"
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
                                    alt="mystery-pokemon"
                                    className={'mystery-pokemon-image shown'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default WhosThatPokemon
