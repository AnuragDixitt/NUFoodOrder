import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ButtonGroup from '@mui/material/ButtonGroup';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const Navbar = () => {
    const navigate = useNavigate();
    const [curr, setCurr] =  useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (curr !== undefined && curr !== null) {
        setCurr(JSON.parse(localStorage.getItem('user')));
        axios
            .get(`http://localhost:4000/user?id=${curr._id}`)
            .then((response) => {
                setCurr(response.data);
                localStorage.setItem('user', JSON.stringify(curr));
            })
            .catch(err => {
                console.log('Err.Message: ', err)
            });
        }
    }, []);

    return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    Canteen Portal
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {curr === undefined || curr === null ?
                    <>
                        <Button color="inherit" href='/login'>
                        Login
                        </Button>
                        <Button color="inherit" href='/register'>
                            Register
                        </Button>
                    </>
                : 

                    (curr.userStatus === 'Vendor' ? (
                        <ButtonGroup>
                            <Button color="inherit" href='/vendor/statistics'>
                                Statistics
                            </Button>
                            <Button color="inherit" 
                                variant='outlined' 
                                startIcon={<RestaurantMenuIcon />} 
                                href={'/vendor/shop-menu'}>
                                Menu
                            </Button>
                            <Button color="inherit" 
                                variant='outlined' 
                                startIcon={<ManageAccountsRoundedIcon />}  
                                href={'/vendor'} >
                                Profile
                            </Button>
                            <Button color="inherit" 
                                variant='outlined' 
                                href={'/vendor/orders'} >
                                My orders
                            </Button>
                            <Button variant='contained' 
                                color="error" startIcon={<LogoutIcon />} 
                                onClick={() => {localStorage.clear(); window.location='/';}} >
                                Logout
                            </Button> 
                        </ButtonGroup>
                        )
                        :(
                        <>
                        <Button color="inherit" style={{'font-weight': 'bold'}} >
                            Wallet: ₹{curr.Wallet}        
                        </Button>
                        
                        <ButtonGroup>
                            <Button color="inherit" 
                                variant='outlined' 
                                startIcon={<RestaurantMenuIcon />} 
                                href={'/buyer/menu'}>
                                Menu
                            </Button>
                            <Button color="inherit" 
                                variant='outlined' 
                                startIcon={<ManageAccountsRoundedIcon />}  
                                href={'/buyer'} >
                                Profile
                            </Button>
                            <Button color="inherit" 
                                variant='outlined' 
                                href={'/buyer/orders'} >
                                My orders
                            </Button>
                            <Button variant='contained' 
                                color="error" startIcon={<LogoutIcon />} 
                                onClick={() => {localStorage.clear(); window.location='/'}} >
                                Logout
                            </Button>
                        </ButtonGroup></>)) 
                    
                }   
            </Toolbar>
        </AppBar>
    </Box>
  );
};

export default Navbar;
