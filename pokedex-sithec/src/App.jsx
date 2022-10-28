import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';



export const App = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    getPokemon();
  },[]);

  const getPokemon = async() =>{
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=100')
    .then((response) => {
      let responseList = response.data.results;

      if(responseList.length > 0){
        responseList.map((item) => getPokemonDetails(item.url))
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getPokemonDetails = async(dataUrl) =>{
    axios.get(dataUrl)
    .then((response) => {

      let data = response.data;

      console.log(data)

      if(Object.keys(data).length > 0){
        const pokemon = {
          name: data.name, 
          sprites: data.sprites, 
          abilities: data.abilities, 
          game_includes: data.game_indices,
          types: data.types,
          order: data.order
        };

        setPokemonList( current => [...current, pokemon]);
      }

     
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  return (
    <table>
      <thead>
        <tr>
          <th>Orden</th>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Habilidades</th>
          <th>Juegos</th>
        </tr>
      </thead>
      <tbody>
        {pokemonList.length > 0 && pokemonList.map((item, index) => 
          <tr key = {index}>
              <td>
                {item.order}
              </td>
              <td>
                <img src={item.sprites.front_default}/>
              </td>
              <td>
                {item.name}
              </td>
              <td>
                {item.types.map((item) => 
                  `${item.type.name} `
                )}
              </td>
              <td> 
                {item.abilities.map((item) => 
                  `${item.ability.name} `
                )} 
              </td>
              <td>
                {item.game_includes.map((item) =>
                  `${item.version.name} `
                )} 
              </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
