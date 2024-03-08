/**
 * @returns {Array} Array con los endpoints de cada pokemon
 * @throws {null}
 * @example [{url: "https://pokeapi.co/api/v2/pokemon/1"}, {...}]
 */
async function fetchPokemonsEndpoints () {
    const urlAPIAll = 'https://pokeapi.co/api/v2/pokemon/';
    
    try {
        const response = await fetch(urlAPIAll); // -> Devuelve una promesa
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


async function printData ($htmlElement) {
    const data = await fetchPokemonsResults();
    
    if (!data) return;
    
    data.forEach( (pokemon, index) => {
        
        // Se crea el card como string
        const cardData = `
        <div class="poke-card" id=${pokemon.id}>
            
            <img src=${pokemon.imgUrl} width="200px" height="200px">
            
            <div class="poke-card-body">
                <h2>${pokemon.name}</h2>
                <span class="poke-numeracion"> N ${++index}</span>
            <div>
            
            <div class="type-container">
                <span class="type-poke">${pokemon.types[0].type.name}<span>
            </div>
       </div>

        `  
        // Se agrega al DOM
        const $temporalDiv = document.createElement('div');
        $temporalDiv.innerHTML = cardData; // -> el string es parseado como contenido HTML
        $htmlElement.appendChild($temporalDiv);
    });
}

const $element = document.querySelector('main');
printData($element);

// #################################################################################### -> V2 EXPLICACION DEL PORQUE USAR FRAGMENT
// -> SIN FRAGMENT
// async function printData ($htmlElement) {
//     const data = await fetchPokemonsResults();

//     // const dataLength = data.length;
//     const dataLength = 3;
//     let index = 0;

//     const intervalId = setInterval(() => {

//         if (index > dataLength){
//             clearInterval(intervalId);
//         }
//         const imgUrl = data[index].imgUrl;
//         const name = data[index].name;
//         const types = data[index].types;

//         const cardData = `
//             <img src=${imgUrl} width="200px" height="200px">
//             <div class="poke-card-body">
//                 <h2>${name}</h2>
//                 <span class="poke-numeracion"> N ${index+ 1}</span>
//                 <div class="type-container">
//                     <span class="type-poke">${types[0].type.name}<span>
//                 </div>
//             </div>
//         `

//         // Se agrega al DOM
//         const $temporalDiv = document.createElement('div');
//         $temporalDiv.className = "poke-card";
//         $temporalDiv.innerHTML = cardData; // -> el string es parseado como contenido HTML
//         $htmlElement.appendChild($temporalDiv); // -> version mejorada
//         index++;
//     }, 300);
// }


// -> CON FRAGMENT
// async function printData ($htmlElement) {

//     const data = await fetchPokemonsResults();
//     const fragment = document.createDocumentFragment();
    
//     // const dataLength = data.length;
//     const dataLength = 3;
//     let index = 0;

//     const intervalId = setInterval(() => {

//         if (index > dataLength){
//             clearInterval(intervalId);
//         }
//         const imgUrl = data[index].imgUrl;
//         const name = data[index].name;
//         const types = data[index].types;

//         const cardData = `
//             <img src=${imgUrl} width="200px" height="200px">
//             <div class="poke-card-body">
//                 <h2>${name}</h2>
//                 <span class="poke-numeracion"> N ${index+ 1}</span>
//                 <div class="type-container">
//                     <span class="type-poke">${types[0].type.name}<span>
//                 </div>
//             </div>
//         `

//         // Se agrega al DOM
//         const $temporalDiv = document.createElement('div');
//         $temporalDiv.className = "poke-card";
//         $temporalDiv.innerHTML = cardData; // -> el string es parseado como contenido HTML
//         fragment.appendChild($temporalDiv); // -> version mejorada
//         index++;
//     }, 300);

//     $htmlElement.appendChild(fragment);
// }

// const $element = document.querySelector('main');
// printData($element);
//