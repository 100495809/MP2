import React, { useState, useEffect } from 'react';
import { getPokemonList, getPokemonDetails } from './api/pokeApi';
import PokemonModal from './PokemonModal';
import './ListView.css'; // Import the CSS file

const ListView: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [pokemonList, setPokemonList] = useState<
        { id: number; name: string; sprite: string }[]
    >([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<'name' | 'id'>('name');
    const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
    const [page, setPage] = useState(0);

    const fetchData = async () => {
        if (searchQuery) {
            try {
                const data = await getPokemonDetails(searchQuery.toLowerCase());
                const detailedPokemon = {
                    id: data.id,
                    name: data.name,
                    sprite: data.sprites.front_default
                };
                setPokemonList([detailedPokemon]);
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
                setPokemonList([]);
            }
        } else {
            const pokemonData = await getPokemonList('', page);
            const detailedList = await Promise.all(
                pokemonData.map(async (pokemon: { name: string }) => {
                    const details = await getPokemonDetails(pokemon.name);
                    return { id: details.id, name: pokemon.name, sprite: details.sprites.front_default };
                })
            );
            setPokemonList(detailedList);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery, page]);

    const sortList = (sortByField: 'name' | 'id') => {
        const sortedList = [...pokemonList].sort((a, b) => {
            if (sortByField === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else {
                return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
            }
        });
        setPokemonList(sortedList);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortBy(sortByField);
    };

    const filteredPokemonList = pokemonList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={"list-view"}>
            <div className={"toGalleryButton"}>
                <button onClick={() => window.location.href = "/gallery"}>
                    {'Switch to Gallery View'}
                </button>
            </div>


                <div className={"list-view-in"}>
                    <div className={"searchbar"}>
                        <input
                            type="text"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchData(); // Trigger the fetch when Enter is pressed
                                }
                            }}
                            placeholder="Search Pokemon"
                        />
                    </div>
                    <div className="sort-buttons">
                        <button onClick={() => sortList('name')}>
                            Sort by Name {sortBy === 'name' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
                        </button>
                        <button onClick={() => sortList('id')}>
                            Sort by ID {sortBy === 'id' ? (sortOrder === 'asc' ? '⬆️' : '⬇️') : ''}
                        </button>
                    </div>
                    <ul className="pokemon-list">
                        {filteredPokemonList.map((pokemon) => (
                            <li key={pokemon.name} className="pokemon-item">
                                <button className="pkmn-name" onClick={() => setSelectedPokemon(pokemon.name)}>
                                    <img src={pokemon.sprite} alt={pokemon.name}/> {/* Display the sprite */}
                                    {pokemon.name} (ID: {pokemon.id}) {/* Display the name and ID */}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <button
                            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                            disabled={page === 0}
                        >
                            Prev
                        </button>
                        <button onClick={() => setPage((prevPage) => prevPage + 1)}>
                            Next
                        </button>
                    </div>

                    {selectedPokemon && (
                        <PokemonModal
                            pokemonName={selectedPokemon}
                            pokemonList={filteredPokemonList}
                            currentIndex={filteredPokemonList.findIndex(p => p.name === selectedPokemon)}
                            onClose={() => setSelectedPokemon(null)}
                        />
                    )}
                </div>

        </div>
    );
};

export default ListView;
