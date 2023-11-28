// src/components/Tools/Pokemon/WhosThatPokemon.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Pokemon.css'
import BackgroundImage from './Background.webp'

const WhosThatPokemon = () => {
    const [pokemonList, setPokemonList] = useState([])
    const [activeGeneration, setActiveGeneration] = useState()
    const [playGame, setPlayGame] = useState(false)

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

    const handlePlayGame = () => {
        setPlayGame(!playGame)
    }

    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    return (
        <div className="whos-that-pokemon-container">
            <h1>Whos That Pokemon</h1>
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
                    <h5>Choose Pokemon Generation:</h5>
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
                <div>
                    <img
                        src={BackgroundImage}
                        alt="Background"
                        className="background-image"
                    />
                </div>
            ) : null}
        </div>
    )
}

export default WhosThatPokemon
