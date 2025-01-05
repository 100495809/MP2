import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPokemonDetails, getPokemonList } from './api/pokeApi';
import "./DetailsView.css"

const DetailsView: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<any>(null);
    const [pokemonList, setPokemonList] = useState<string[]>([]);
    const navigate = useNavigate();

    // Fetch the full Pokemon list when the component mounts
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const list = await getPokemonList(pokemonList.toString(), 0); // This API call fetches the full list of Pokémon names
                setPokemonList(list.map((pokemon: any) => pokemon.name)); // Extract only names
            } catch (error) {
                console.error('Error fetching Pokémon list:', error);
            }
        };
        fetchPokemonList();
    }, []); // Empty dependency array means this runs once when the component mounts

    // Fetch individual Pokémon details based on the name in the URL
    useEffect(() => {
        if (name) {
            const fetchData = async () => {
                try {
                    const data = await getPokemonDetails(name);
                    setPokemon(data);
                } catch (error) {
                    console.error('Error fetching Pokémon details:', error);
                }
            };
            fetchData();
        }
    }, [name]);

    if (!pokemon) return <div>Loading...</div>;

    // Find the current Pokémon's index in the list
    const currentIndex = pokemonList.findIndex((item) => item === name);
    const prevPokemon = pokemonList[currentIndex - 1] || pokemonList[pokemonList.length - 1]; // Wrap around to the last Pokémon
    const nextPokemon = pokemonList[currentIndex + 1] || pokemonList[0]; // Wrap around to the first Pokémon

    return (
        <div className={"pkmn-details"}>
            <h1>{pokemon.name}</h1>
            <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
            <p>Type: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
            <p>Height: {pokemon.height}</p>
            <p>Weight: {pokemon.weight}</p>
            <p>Order: {pokemon.order}</p>
            <p>Base exp: {pokemon.base_experience}</p>

            {/* Use navigate to programmatically change pages */}
            <button onClick={() => navigate(`/details/${prevPokemon}`)}>
                Previous
            </button>
            <button onClick={() => navigate(`/details/${nextPokemon}`)}>
                Next
            </button>
        </div>
    );
};

export default DetailsView;
