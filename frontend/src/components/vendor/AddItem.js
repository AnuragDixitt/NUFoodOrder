import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import swal from 'sweetalert';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]

const indices = new Array(10).fill().map((_, idx) => idx);

const AddFoodItem = (props) => {

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const ShopName = user.ShopName;

    const [Name, setName] = useState('');
    const [Price, setPrice] = useState(0);
    const [Rating, setRating] = useState(0);
    const [Veg, setVeg] = useState(true);

    const [addOnBool, setAddOnBool] = useState(new Array(10).fill(false));
    const [addOnPrice, setAddOnPrice] = useState(new Array(10).fill(0));

    const [tagBool, setTagBool] = useState(new Array(10).fill(false));

    const handleChangeTagBool = (idx) => event => {
        const tmp = [...tagBool]; tmp[idx] = event.target.checked;
        setTagBool(tmp);
    }

    const onChangeVeg = (e) => {
        setVeg(!e.target.value);
    }

    const handleChangeBool = (idx) => event => {
        const tmp = [...addOnBool]; tmp[idx] = event.target.checked; 
        setAddOnBool(tmp);
    }

    const handleChangePrice = (idx) => event => {
        const tmp = [...addOnPrice]; tmp[idx] = event.target.value;
        setAddOnPrice(tmp);
    }

    const onChangeName = (e) => {
        setName(e.target.value);
    }
    const onChangePrice = (e) => {
        setPrice(e.target.value);
    }

    const onAddFoodItem = (event) => {
        event.preventDefault();

        let tagSet = 0 >>> 0;

        let addOnList = [];
        indices.forEach((i) => {
            if (tagBool[i]) 
                tagSet = tagSet | (1 << i);
            if (addOnBool[i])
                addOnList.push({Name: i, Price: addOnPrice[i]});
        });

        const newItem = {
            Name: Name,
            Price: Price,
            Rating: 0,
            Veg: Veg,
            AddOns: addOnList, 
            Tags: tagSet,
            VendorID: userID,
            ShopName: ShopName,
            VendorName: user.Name,
            CanteenOpeningTime: user.OpeningTime,
            CanteenClosingTime: user.ClosingTime,
            BuyersRated: 0
        };
        console.log(newItem);
        axios
            .post('http://localhost:4000/food/insert-item', newItem)
            .then((response) => {
                console.log(response.data);
                alert('Added food item, ' + response.data.Name + ' to your menu.');
            }).catch(err => console.log(err.response.data.errMsg));
    }   

  return (
    <div align={'center'} >

       
                    <Grid container align={'center'} spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label='Food item name'
                                variant='outlined'
                                value={Name}
                                onChange={onChangeName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label='Price'
                                variant='outlined'
                                value={Price}
                                onChange={onChangePrice}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">Veg or Non-veg?</FormLabel>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    value={Veg}
                                    onChange={onChangeVeg}
                                    // defaultValue="female"
                                    name="radio-buttons-group"
                                >
                                    <FormControlLabel value={true} control={<Radio />} label="Veg" />
                                    <FormControlLabel value={false} control={<Radio />} label="Non-veg" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend" align={'center'}>Add ons: </FormLabel>
                            <FormGroup>
                            <Grid container spacing={1}>
                            {indices.map((i) => (
                            <Grid item xs={12}>
                                <Grid item xs={10} >
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={addOnBool[i]} onChange={handleChangeBool(i)} />
                                        }
                                        label={ADD_ONS[i]}
                                    />
                                </Grid>
                                <Grid item  xs={2}  >
                                    <TextField
                                        size='small'
                                        label={ADD_ONS[i] + ' price'}
                                        variant='outlined'
                                        value={addOnPrice[i]}
                                        onChange={handleChangePrice(i)}
                                    />
                                </Grid>
                            </Grid>
                            ))}
                            </Grid>
                            </FormGroup>
                        </FormControl>
                        </Grid>

                        <Grid item xs={12} >
                        <Box sx={{ display: 'flex' }}>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend" align={'center'}>Tags: </FormLabel>
                            <FormGroup>
                            <Grid container spacing={1} >
                            {indices.map((i) => (
                            <Grid item xs={12}>
                                <FormControlLabel align={'center'}
                                    control={
                                        <Checkbox checked={tagBool[i]} onChange={handleChangeTagBool(i)} />
                                    }
                                    label={TAGS[i]}
                                />
                            </Grid>
                            ))}
                            </Grid>
                            </FormGroup>
                        </FormControl>
                        </Box>
                        </Grid>
                        
                    </Grid>
               
        <Grid item xs={12} align={'center'}>
            <Button variant='contained' onClick={onAddFoodItem}>
                Add Food Item
            </Button>
        </Grid>

    </div>
  );
};

export default AddFoodItem;
