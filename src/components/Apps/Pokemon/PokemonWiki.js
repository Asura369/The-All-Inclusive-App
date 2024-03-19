// src/components/Apps/Pokemon/PokemonWiki.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Pokemon.css'

const PokemonWiki = () => {
    const [pokemonList, setPokemonList] = useState([]) // Store the list of Pokemon
    const [activeGeneration, setActiveGeneration] = useState() // Store the active Pokemon generation
    const [currentPage, setCurrentPage] = useState(1) // Store the current page number for pagination
    const itemsPerPage = 20 // Number of Pokemon items to display per page

    // Pokemon generation range dictionary
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

    // Fetch Pokemon list based on the selected generation
    const fetchPokemonList = async (generation) => {
        setCurrentPage(1) // Reset the current page when changing the generation
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

    // Extract Pokemon ID from the URL
    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = pokemonList.slice(indexOfFirstItem, indexOfLastItem)

    // Set the current page number
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // JSX rendering
    return (
        <div className="pokemon-list-container">
            <h1>Pokemon List</h1>
            <Link to="/WhosThatPokemon" className="go-to-game">
                Play Whos That Pokemon Game
            </Link>
            <div className="generation-buttons">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((generation) => (
                    <button
                        key={generation}
                        className={
                            generation === activeGeneration ? 'active' : ''
                        }
                        onClick={() => fetchPokemonList(generation)}
                    >
                        Generation {generation}
                    </button>
                ))}
            </div>
            <ul className="pokemon-table">
                {currentItems.map((pokemon) => (
                    <li key={pokemon.name} className="pokemon-item">
                        <span className="pokemon-id">
                            {getPokemonIdFromUrl(pokemon.url)}
                        </span>
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(
                                pokemon.url
                            )}.png`}
                            alt={pokemon.name}
                            className="pokemon-image"
                        />
                        <span className="pokemon-name">{pokemon.name} </span>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {Array.from(
                    { length: Math.ceil(pokemonList.length / itemsPerPage) },
                    (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={
                                currentPage === index + 1 ? 'active' : ''
                            }
                        >
                            {index + 1}
                        </button>
                    )
                )}
            </div>
        </div>
    )
}

export default PokemonWiki
