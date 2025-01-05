import React, { useState, useEffect } from 'react';
import { getPokemonList, getPokemonDetails } from './api/pokeApi';
import PokemonModal from './PokemonModal';
import './GalleryView.css'; // Import the CSS file for gallery styling

interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    };
    types: Array<{ type: { name: string } }>;
    height: number; // Add height
}

const GalleryView: React.FC = () => {
    const [pokemonList, setPokemonList] = useState<PokemonDetails[]>([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [heightFilter, setHeightFilter] = useState(''); // Add height filter state
    const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
    const [filteredPokemonList, setFilteredPokemonList] = useState<PokemonDetails[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPokemonList('', 0, 7 * 1000); // Fetch list of Pokémon (basic data)

                // Fetch details (including id, sprites, types, and height) for each Pokémon
                const detailedList = await Promise.all(
                    result.map(async (pokemon: { name: string }) => {
                        const details = await getPokemonDetails(pokemon.name);
                        return {
                            id: details.id,
                            name: details.name,
                            sprites: details.sprites,
                            types: details.types,
                            height: details.height, // Ensure height is fetched
                        };
                    })
                );
                setPokemonList(detailedList);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        };
        fetchData().then(_ => console.log("Data Fetched"));
    }, []);

    // Filter Pokémon by selected type and height
    useEffect(() => {
        const filteredList = pokemonList.filter((pokemon) => {
            const matchesType = typeFilter
                ? pokemon.types.some((type) => type.type.name === typeFilter)
                : true;

            const matchesHeight = heightFilter
                ? (heightFilter === 'small' && pokemon.height < 10) ||
                (heightFilter === 'medium' && pokemon.height >= 10 && pokemon.height <= 20) ||
                (heightFilter === 'large' && pokemon.height > 20)
                : true;

            return matchesType && matchesHeight;
        });
        setFilteredPokemonList(filteredList);
    }, [typeFilter, heightFilter, pokemonList]);

    return (
        <div className={"gallery-view"}>
            <div className={"toListButton"}>
                <button onClick={() => window.location.href = "/"}>
                    {'Switch to List View'}
                </button>
            </div>

            <div className="gallery-container">
                <div className="filter-controls">
                    <label htmlFor="typeFilter">Filter by Type:</label>
                    <select id="typeFilter" onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="fire">Fire</option>
                        <option value="water">Water</option>
                        <option value="grass">Grass</option>
                        <option value="electric">Electric</option>
                        <option value="normal">Normal</option>
                    </select>

                    <label htmlFor="heightFilter">Filter by Height:</label>
                    <select id="heightFilter" onChange={(e) => setHeightFilter(e.target.value)}>
                        <option value="">All</option>
                        <option value="small">Small (Less than 10)</option>
                        <option value="medium">Medium (10 to 20)</option>
                        <option value="large">Large (More than 20)</option>
                    </select>
                </div>

                <div className="gallery">
                    {filteredPokemonList.map((pokemon, _) => (
                        <div key={pokemon.name} className="gallery-item">
                            <button className="pkmn-name" onClick={() => setSelectedPokemon(pokemon.name)}>
                                <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Show modal when a Pokémon is selected */}
                {selectedPokemon && (
                    <PokemonModal
                        pokemonName={selectedPokemon}
                        pokemonList={filteredPokemonList.map(p => ({
                            id: p.id,
                            name: p.name,
                            sprite: p.sprites.front_default,
                        }))}
                        currentIndex={filteredPokemonList.findIndex(p => p.name === selectedPokemon)}
                        onClose={() => setSelectedPokemon(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default GalleryView;
