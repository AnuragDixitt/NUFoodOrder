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
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Badge } from "@mui/material";
import { useCart, useDiapatchCart } from "./ContextReducer";


const Navbar = () => {
    const navigate = useNavigate();
    const [curr, setCurr] =  useState(JSON.parse(localStorage.getItem('user')));

    function deleteCookie(cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    
    let data = useCart();

    const handleCart = () => {
        navigate("/buyer/cart")
    }

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
    <Box sx={{ flexGrow: 1,bgcolor: "#000000", "& .MuiAppBar-root": { backgroundColor: "#000000" }, height: "64px", padding: "5px"}}>
        <AppBar position="static">
            <Toolbar>
                
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    NuOrder
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {curr === undefined || curr === null ?
                    <>
                        <Button color="inherit" href='/login' style={{ fontSize: "1.2rem" }}>
                        Login
                        </Button>
                        <Button color="inherit" href='/register' style={{ fontSize: "1.2rem" }}>
                            Register
                        </Button>
                    </>
                : 

                    (curr.userStatus === 'Vendor' ? (
                        <ButtonGroup>
                            <Button color="inherit" href='/vendor/statistics' style={{ fontSize: "1.2rem",  marginRight: "20px" }} variant='text' >
                                Statistics
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                startIcon={<RestaurantMenuIcon />} 
                                href={'/vendor/shop-menu'} style={{ fontSize: "1.2rem",  marginRight: "20px" }}>
                                Menu
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                startIcon={<ManageAccountsRoundedIcon />}  
                                href={'/vendor'} style={{ fontSize: "1.2rem",  marginRight: "20px" }}>
                                Profile
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                href={'/vendor/orders'} style={{ fontSize: "1.2rem",  marginRight: "20px" }} >
                                My orders
                            </Button>
                            <Button variant='contained' 
                                color="error" startIcon={<LogoutIcon /> } 
                                onClick={() => {
                                    deleteCookie('jwt')
                                    deleteCookie('refresh')
                                    localStorage.clear(); 
                                    window.location='/';
                                    }} >
                                Logout
                            </Button> 
                        </ButtonGroup>
                        )
                        :(
                        <>
                        <ButtonGroup>
                            <Button color="inherit" style={{fontSize: "1.2rem",  marginRight: "20px"}} onClick={handleCart} variant="text">
                                <ShoppingCartIcon style={{marginRight: '0.5rem'}} />
                                My Cart {" "}
                                <Badge color="secondary" badgeContent={data.length} />
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                startIcon={<RestaurantMenuIcon />} 
                                href={'/buyer/menu'} style={{ fontSize: "1.2rem", marginRight: "20px" }}>
                                Menu
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                startIcon={<ManageAccountsRoundedIcon />}  
                                href={'/buyer'} style={{ fontSize: "1.2rem",  marginRight: "20px" }}>
                                Profile
                            </Button>
                            <Button color="inherit" 
                                variant='text' 
                                href={'/buyer/orders'} style={{ fontSize: "1.2rem",  marginRight: "20px" }}>
                                My orders
                            </Button>
                            <Button variant='contained' 
                                color="error" startIcon={<LogoutIcon />} 
                                onClick={() => {localStorage.clear(); window.location='/'}} style={{ fontSize: "1.2rem" }} >
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
