import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

export const TableFavorites = ({favorites, setShowFavorites}) => {
    
    const [getFavorites, setGetFavorites] = useState([]);

    useEffect(() => {
        
        const items = JSON.parse(localStorage.getItem('Favorites'))
        console.log(items);

        if (items) {
          setGetFavorites(items);
        }
    }, [favorites]);

    return (
        <>
            <Button onClick ={() => setShowFavorites(false)} variant="contained"  sx={{float:'right', margin: '10px'}}>Regresar</Button>
     
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontSize: "25px"}}>Favoritos</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Foto</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Habilidades</TableCell>
                        <TableCell>Juegos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getFavorites.length > 0 && 
                    getFavorites.map((items, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="right">
                        <img src={items.sprites.front_default}/>
                        </TableCell>
                        <TableCell align="right">
                        {items.name}
                        </TableCell>
                        <TableCell align="right">
                        {items.types.map((row, idx) => 
                            <Chip key={idx} color="success" variant="outlined" label={row.type.name}/>
                        )}
                        </TableCell>
                        <TableCell align="right">
                        {items.abilities.map((row, idx) => 
                            <Chip key={idx} color="success" variant="outlined" label={row.ability.name}/>
                        )}
                        </TableCell>
                        <TableCell align="right">
                        {items.game_includes.map((row, idx) =>
                            <Chip key={idx} color="primary" variant="outlined" label={row.version.name} sx = {{ margin: "5px" }} />
                        )} 
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </>
      
    )
}
