import React, { useState } from 'react'
import './WhosThatPokemon.css'

const WhosThatPokemon = () => {
    const [pokemonList, setPokemonList] = useState([])
    const [activeGeneration, setActiveGeneration] = useState()

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

    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    return (
        <div className="whos-that-pokemon-container">
            <h1>Pokemon List</h1>
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
                {pokemonList.map((pokemon) => (
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
        </div>
    )
}

export default WhosThatPokemon
