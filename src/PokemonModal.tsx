import React, { useEffect, useState } from 'react';
import { getPokemonDetails } from './api/pokeApi';
import './PokemonModal.css';

interface PokemonModalProps {
    pokemonName: string;
    pokemonList: { id: number; name: string; sprite: string }[];
    onClose: () => void;
    currentIndex: number;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemonName, onClose, pokemonList, currentIndex }) => {
    const [pokemon, setPokemon] = useState<any>(null);
    const [index, setIndex] = useState(currentIndex); // Track the current index in state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemonDetails(pokemonList[index].name); // Fetch data using the updated index
                setPokemon(data);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
            }
        };
        fetchData();
    }, [index, pokemonList]);

    if (!pokemon) return <div>Loading...</div>;

    const prevIndex = (index - 1 + pokemonList.length) % pokemonList.length; // Ensure circular navigation
    const nextIndex = (index + 1) % pokemonList.length;

    const handleNext = () => {
        setIndex(nextIndex); // Update the index and re-fetch the next Pokémon
    };

    const handlePrev = () => {
        setIndex(prevIndex); // Update the index and re-fetch the previous Pokémon
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
                <a href={`/details/${pokemon.name}`}>
                    <h1 className="modal-title">{pokemon.name}</h1>
                </a>
                <div className="modal-img">
                    <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
                </div>
                <p>Type: {pokemon.types.map((type: any) => type.type.name).join(', ')}</p>
                <p>Height: {pokemon.height}</p>
                <p>Weight: {pokemon.weight}</p>

                {/* Navigation Buttons */}
                <div className="modal-button">
                    <button onClick={handlePrev}>Previous</button>
                    <button onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
            );
            };

            export default PokemonModal;
