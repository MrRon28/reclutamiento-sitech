import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { TableFavorites } from './TableFavorites';
import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';

export const TablePokemon = () => {

  const [pokemonList, setPokemonList] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [offset, setOffset ] = useState(0);
  const [favorites, setFavorites ] = useState([]);
  const [showFavorites, setShowFavorites ] = useState(false);

  useEffect(() => {
    getPokemon();
  },[]);

  useEffect(() => {
    getPokemon();
  },[page, rowsPerPage]);

  const getPokemon = async() =>{
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${rowsPerPage}&offset=${offset}`)
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

      if(Object.keys(data).length > 0){
        const pokemon = {
          name: data.name, 
          sprites: data.sprites, 
          abilities: data.abilities, 
          game_includes: data.game_indices,
          types: data.types,
          favorite: false
        };

        setPokemonList( current => [...current, pokemon]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOffset(page * 10);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    setOffset(0 * 10);
  };

  useEffect(() => {
    localStorage.setItem('Favorites', JSON.stringify(favorites));
  }, [favorites]);

  const saveFavorites = (row) => {

    // Actualiza tabla de favoritos

    const cloneFavorites = [...favorites];

    if(Object.keys(cloneFavorites).length === 0){
      setFavorites([row]);
    }else{
      const index = cloneFavorites.findIndex(object => object.name === row.name);
  
      if (index === -1) {
        setFavorites( current => [...current, row]);
      }
    }

    // Actualiza tabla general
    const clonePokemonList = [...pokemonList];

    const itemFavorite = clonePokemonList.findIndex(object => object.name === row.name);
    clonePokemonList[itemFavorite]= {...row, favorite: true}
    setPokemonList(clonePokemonList);
   
  }

  return (
    <>
        {showFavorites ? (
          <TableFavorites 
            favorites = {favorites}
            setShowFavorites = {setShowFavorites}
          />
        ):(
          <>
            <Button onClick ={() => setShowFavorites(true)} variant="contained"  sx={{float:'right', margin: '10px'}}>Ver Favoritos</Button>
      
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Favorito</TableCell>
                        <TableCell>Foto</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Habilidades</TableCell>
                        <TableCell>Juegos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {pokemonList.length > 0 && 
                    pokemonList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align="right">
                        <IconButton aria-label="favorite" onClick = {() => saveFavorites(row)}>
                          {row.favorite ?
                            <FavoriteIcon /> : <FavoriteBorderIcon />
                          }
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <img src={row.sprites.front_default}/>
                      </TableCell>
                      <TableCell align="right">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">
                        {row.types.map((item, idx) => 
                          <Chip key={idx} color="success" variant="outlined" label={item.type.name}/>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.abilities.map((item, idx) => 
                          <Chip key={idx} color="success" variant="outlined" label={item.ability.name}/>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {row.game_includes.map((item, idx) =>
                          <Chip key={idx} color="primary" variant="outlined" label={item.version.name} sx = {{ margin: "5px" }} />
                        )} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={pokemonList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )
      }
    </>
  )
}
