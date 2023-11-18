import React, { useEffect, useState } from 'react'
import './WhosThatPokemon.css' // Import the CSS file for styling

const WhosThatPokemon = () => {
    const [pokemonList, setPokemonList] = useState([])

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await fetch(
                    'https://pokeapi.co/api/v2/pokemon?limit=151'
                )
                const data = await response.json()
                const data_list = data.results
                console.log(data_list)
                setPokemonList(data_list)
            } catch (error) {
                console.error('Error fetching Pokemon data:', error)
            }
        }

        fetchPokemonList()
    }, [])

    function getPokemonIdFromUrl(url) {
        const parts = url.split('/')
        const pokemon_id = parts[parts.length - 2]
        return pokemon_id
    }

    return (
        <div>
            <h1>Pokemon List</h1>
            <ul>
                {pokemonList.map((pokemon) => (
                    <li key={pokemon.name} className="pokemon-item">
                        <span className="pokemon-name">{pokemon.name} </span>
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonIdFromUrl(
                                pokemon.url
                            )}.png`}
                            alt={pokemon.name}
                            className="pokemon-image"
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WhosThatPokemon
