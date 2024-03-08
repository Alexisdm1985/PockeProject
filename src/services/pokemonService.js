const POKEMON_SERVICE = {
    API_URL: 'https://pokeapi.co/api/v2/pokemon/',
}

/**
* @returns {Array} Array con los endpoints de cada pokemon
 * @throws {null}
 * @example [{url: "https://pokeapi.co/api/v2/pokemon/1"}, {...}]
 */
async function fetchPokemonsEndpoints () {
    
    try {
        const response = await fetch(POKEMON_SERVICE.API_URL); // -> Devuelve una promesa
        if (!response.ok){
            throw new Error("Ha ocurrido un error uwu");
        };
        
        const data = await response.json(); // -> Devuelve los datos de la promesa, en formato JSON

        const endpoints = data.results.map( (pokemon) => {
            return {
                url: pokemon.url
            }
        });

        return endpoints;

    } catch (error) {
        console.error(error)
        return null;
    }

}

/**
 * 
 * @returns {Array} Array con los datos de los pokemones
 * @example {id: int, name: str, imgUrl: str, types: array[{}]}
 */
async function fetchPokemonsResults () {
    try {
        const pokemonsEndpoints = await fetchPokemonsEndpoints();
    
        if (!pokemonsEndpoints){
            return;
        }

        const pokemonData = pokemonsEndpoints.map( async (pokemon) => { // returns -> [Promise, Promise, ...]
                const response = await fetch(pokemon.url);
                
                if (!response.ok){
                    return null;
                }
        
                const data = await response.json();
                
                return  {
                    name: data.name,
                    imgUrl: data.sprites.other.dream_world.front_default,
                    types: data.types,
                    id: data.id
                }
        })

        // Una vez esten listas todas las promesas retorna los resultados
        const results = await Promise.all(pokemonData);
        return results;

    } catch (error) {
        console.error(error, "desde fetchPokemonsResults");
        return null
        
    }
}

async function fetchPokemonById (Id){
    try {
        const response = await fetch(`${POKEMON_SERVICE.API_URL}${Id}`);
        if (!response.ok){
            return null;
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error(error, "desde fetchPokemonById");
        return null
        
    }
}

export {
    fetchPokemonsResults,
    fetchPokemonById
}