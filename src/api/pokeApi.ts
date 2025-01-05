import axios from 'axios';

export const getPokemonList = async (query: string, offset: number, quant = 20) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${quant}&offset=${quant*offset}`);
    // Filter based on the query
    const filteredData = response.data.results.filter((pokemon: { name: string }) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    return filteredData;
};

export const getPokemonDetails = async (name: string) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return response.data;
};
// https://pokeapi.co/api/v2/pokemon/135

