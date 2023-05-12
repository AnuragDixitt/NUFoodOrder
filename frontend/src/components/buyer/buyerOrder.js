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
import Chip from '@mui/material/Chip';
import swal from 'sweetalert';
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Rating from '@mui/material/Rating';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from "@mui/material/Divider";
import DialogTitle from '@mui/material/DialogTitle';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from "@mui/material/InputAdornment";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Fuse from 'fuse.js'
import { useCart, useDispatchCart } from "../templates/ContextReducer";


const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"];
const revMap = new Map([
    ["Beverage", 0], 
    ["Hot", 1], 
    ["Cold", 2], 
    ["Meal", 3], 
    ["Snacks", 4],  
    ["Spicy", 5],  
    ["Very spicy", 6], 
    ["Sweet", 7],  
    ["Dessert", 8], 
    ["Vegan", 9]
]);

const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]
const indices = new Array(10).fill().map((_, idx) => idx);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const MenuProps2 = {
    PaperProps: {
      style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 10        },
    },
};


function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

const BuyerFoodMenu = (props) => {
    const navigate = useNavigate();
    const Input = styled(MuiInput)`
    width: 60px;
    `;

    const user = JSON.parse(localStorage.getItem('user'))
    const userID = user._id;
    const ShopName = user.ShopName;

    const [foodMenu, setFoodMenu] = useState([]);
    const [filteredMenu, setFilteredMenu] = useState([]);
    const [lower, setLower] = useState();
    const [upper, setUpper] = useState();
    const [tagList, setTagList] = useState([]);
    const [filterTagSet, setFilterTagSet] = useState(0);
    const [sortByPrice, setSortByPrice] = useState(false);
    const [sortByRating, setSortByRating] = useState(false);
    const [filterVeg, setFilterVeg] = useState(2);
    const [shops, setShops] = useState([]);
    const [filterShops, setFilterShops] = useState([]);
    const [shopStr, setShopStr] = useState([]);
    const [searchText, setSearchText] = useState('');

    // Canteen opening time
    const [COT, setCOT] = useState(null);
    // Canteen closing time
    const [CCT, setCCT] = useState(null);

    const [chips, setChips] = useState([]);
    const [addON, setAddON] = useState([]);

    const [open, setOpen] = useState(false);
    const [cartVendor, setCartVendor] = useState('');

    const [currOrder, setCurrOrder] = useState({food: {
        Name: '', ShopName: '', Price: 0, AddOns: []
    }, quantity: 0, addOn: ''});
  
    const onChangeFilterVeg = (e) => {
        setFilterVeg(e.target.value);
    }

    const handleClose = () => {
        setAddON([]); setChips([]);
        setCurrOrder({food: {
            Name: '', ShopName: '', Price: 0, AddOns: [], VendorID: null
        }, quantity: 0, addOn: ''});
        setOpen(false);
    };

    function MutliSelectChip(props) {
        const theme = useTheme();
    
        const handleChange = (event) => {
            const {
            target: { value },
            } = event;
            setAddON(
            typeof value === 'string' ? value.split(',') : value,
            );
        };
    
        return (
            <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Add ons</InputLabel>
                <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={addON}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
                MenuProps={MenuProps}
                >
                {props.addONList.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, addON, theme)}
                    >
                    {name}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            </div>
        );
    }

    function MutliSelectChip2(props) {
    
        const handleChange = (event) => {
            const {
            target: { value },
            } = event;
            setTagList(
            typeof value === 'string' ? value.split(', ') : value,
            );
            setFilterTagSet(value.reduce((prev, curr) => {
                const bit = revMap.get(curr);
                return (prev | (bit === undefined ? 0 : (1 << bit)));
            }, 0));
        };
    
        return (
            <div>
            <FormControl sx={{ m: 1, width: 390 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tags</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={tagList}
          onChange={handleChange}
          input={<OutlinedInput label="Tags" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps2}
        >
            {TAGS.map((name) => (
                <MenuItem key={name} value={name}>
                <Checkbox checked={tagList.indexOf(name) > -1} />
                <ListItemText primary={name} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>
        </div>
        );
    }

    function MultiSelectShops(props) {
    
        const handleChange = (event) => {
            console.log("event", shops);
            const {
            target: { value },
            } = event;
            setShopStr(
            typeof value === 'string' ? value.split(', ') : value,
            );
            setFilterShops(value);
        };
    
        return (
            <div>
            <FormControl sx={{ m: 1, width: 390 }}>
        <InputLabel id="demo-multiple-checkbox-label">Shops</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={shopStr}
          onChange={handleChange}
          input={<OutlinedInput label="Shops" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps2}
        >
          {shops.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={shopStr.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
        );
    }
    

    const isCanteenOpen = (date, O_hrs, O_mins, C_hrs, C_mins) => {
        const Now_hrs = date.getHours(); const Now_mins = date.getMinutes();
        return Boolean(((O_hrs < Now_hrs || (O_hrs === Now_hrs && O_mins <= Now_mins)) && 
                ((Now_hrs < C_hrs || (Now_hrs === C_hrs && Now_mins <= C_mins)))));
    }

    let dispatch = useDispatchCart();
    let data = useCart();

    const DateAndTime = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    }


    const handleAddToCart = async () => {
        if (currOrder.quantity === 0) {
            swal("Error", "Please enter a valid quantity", "error"); return;
        }
        setCOT(new Date(currOrder.food.CanteenOpeningTime)); setCCT(new Date(currOrder.food.CanteenClosingTime));
        const date = new Date();
        if (!isCanteenOpen(date, COT.getHours(), COT.getMinutes(), CCT.getHours(), CCT.getMinutes())) {
            swal("Error", `Sorry for the inconvenience. ${currOrder.food.ShopName} is not open right now.`, "error"); 
            setCurrOrder({food: {
                Name: '', ShopName: '', Price: 0, AddOns: []
            }, quantity: 0, addOn: ''});
            setOpen(false); return;
        }
        const Totall = (currOrder.food.Price + (addON.map((a) => Number((a.split('₹'))[1])).reduce((prev, curr) => (prev + curr), 0))) * currOrder.quantity;
        
        console.log("cart : ", cartVendor);
        if (cartVendor=== '' || cartVendor === currOrder.food.VendorName) {
            await dispatch({type: "Add",
            VendorID: currOrder.food.VendorID,
            BuyerID: userID,
            BuyerEmail: user.Email,
            VendorName: currOrder.food.VendorName,
            foodItem: currOrder.food.Name,
            Veg: currOrder.food.Veg,
            AddOns: (addON.map((a) => (a.split(':'))[0]).join(', ')),
            Total: Totall,
            Quantity: currOrder.quantity,
            Date: DateAndTime(date),
            buyerAge: user.Age,
            buyerBatch: user.BatchName,
            Rating: -1,
            })
            console.log("in cart : ", currOrder.food.VendorName);
            setCartVendor(currOrder.food.VendorName);
            setOpen(false);}
        else {
            swal("Error", "Sorry, you can't order from two different vendors at the same time.", "error"); 
        }
    }

    
    const changeQuantity = (event) => {
        setCurrOrder({...currOrder, quantity:(event.target.value < 0 ? 0 : event.target.value)});
    };

    useEffect(() => {
        axios
          .get('http://localhost:4000/food')
          .then((response) => {
            console.log(" data : ", response.data);
            setFoodMenu(response.data);
            setFilteredMenu(response.data);
            const shopNames = response.data.reduce((acc, item) => acc.add(item.ShopName), new Set());
            setShops(Array.from(shopNames));
            setFilterTagSet(0);
            setSearchText('');
          })
          .catch(err => {
            console.log('Err')
          })
      }, []);

    const searchBar = (event) => {
        setSearchText(event.target.value);
    }

    useEffect(() => {
        if (searchText === null || searchText === undefined || (searchText === '')) {
            setFilteredMenu(foodMenu);
        } else {
            const fuse = new Fuse(foodMenu, {
                keys: ['Name']
            });
            const results = fuse.search(searchText);
            if (results.length) {
                setFilteredMenu(results.map(result => result.item));
            } else {
                setFilteredMenu([]);
            }
        }
    }, [searchText]);

    const changeLower = (e) => {
        setLower(e.target.value);
    }

    const changeUpper = (e) => {
        setUpper(e.target.value);
    }

    const onSortByPrice = () => {
        let tmp = filteredMenu;
        const flag = sortByPrice;
        tmp.sort((a, b) => ((2 * flag - 1) * (b.Price - a.Price)));
        setFilteredMenu(tmp);
        setSortByPrice(!flag);
    };

    const onSortByRating = () => {
        let tmp = filteredMenu;
        const flag = sortByRating;
        tmp.sort((a, b) => ((2 * flag - 1) * (a.Rating - b.Rating)));
        setFilteredMenu(tmp);
        setSortByRating(!flag);
    }


    const getTags = (tagSet) => {
        let tagList = [];
        TAGS.forEach((tag, idx) => {if ((tagSet >> idx) & 1) tagList.push(tag);})
        return tagList;
    }

  return (
    <div style={{ backgroundColor: "#F5FEFD", height: "400vh" }}>
    <div align={'center'}>

        <Grid container>
            <Grid item xs={12} md={3} lg={3} style={{ display: "flex", justifyContent: "center" }}>
            <List component="nav" aria-label="mailbox folders">
                <ListItem text>
                <h1 style={{ fontSize: "35px" }}>Filters</h1>
                </ListItem>
            </List>
            </Grid>
            <Grid item xs={12} md={9} lg={9}>
            <Box boxShadow={5} borderRadius="0 0 20px 20px" p={2} mb={2} style={{ backgroundColor: "#ffffff" }}>   
            <List component="nav" aria-label="mailbox folders">
                <TextField
                id="standard-basic"
                label="Search"
                fullWidth={true}
                InputProps={{
                    endAdornment: (
                    <InputAdornment>
                        <IconButton>
                        <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                    ),
                }}
                onChange={searchBar}
                />
            </List>
            </Box>
            </Grid>
        </Grid>
        <Grid container >
        <Grid item xs={12} md={3} lg={3} sx={{backgroundColor:"#F5F5DC",height: "785px",width:"550px", borderRadius: " 0px 30px 30px 0px"}}>
          <List component="nav" aria-label="mailbox folders" >
            <ListItem style={{ marginBottom: "16px" }}>
              <Grid container spacing={3}>
                    <Grid item xs={24} sx={{mb:3,textAlign: "center" }} style={{ fontSize: "24px" ,fontWeight:"bold"}}>
                    Food item price
                    </Grid>
                    <Grid container direction="column" alignItems="center" spacing={3}>
                    <Grid item xs={6}>
                    <TextField
                        id="standard-basic"
                        label="Enter Min"
                        fullWidth={true}
                        value={lower}
                        onChange={changeLower}
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <TextField
                        id="standard-basic"
                        label="Enter Max"
                        fullWidth={true}
                        value={upper}
                        onChange={changeUpper}
                    />
                    </Grid>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem  style={{width: "100px", marginTop: "16px", marginBottom: "16px", marginRight: "360px", marginLeft: "0px" }}>
              <MutliSelectChip2 style={{width: "200px"}}/>
            </ListItem>
            <Divider />
            <ListItem style={{width: "100px", marginTop: "16px", marginBottom: "16px", marginRight: "360px", marginLeft: "0px" }}>
                <FormControl sx={{ m: 1, minWidth: 390 }}>
                    <InputLabel id="demo-simple-select-helper-label" style={{width: "200px"}}>Veg or Non-veg?</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={filterVeg}
                        label="Veg or Non-veg?"
                        onChange={onChangeFilterVeg}
                    >
                    <MenuItem value={2}>
                        <em>Both</em>
                    </MenuItem>
                    <MenuItem value={1}>Veg</MenuItem>
                    <MenuItem value={0}>Non-veg</MenuItem>
                    </Select>
                </FormControl>
            </ListItem>
            <Divider />
            <ListItem style={{width: "100px", marginTop: "16px", marginBottom: "16px", marginRight: "360px", marginLeft: "0px" }}>
                <MultiSelectShops style={{width: "200px"}}/>
            </ListItem>
            <Divider/>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
            <Paper sx = {{ml:5, borderRadius: "15px 15px 15px 15px"}}>
                <Table size="small" style={{backgroundColor: "#ff6602", borderRadius: "15px 15px 0px 0px"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontSize: '20px' }} align="center"> Sr No.</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">Food item</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">Shop</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">
                                {" "}
                                <Button onClick={onSortByPrice}>
                                {sortByPrice ?  <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                </Button>
                                Price
                            </TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">Veg/Non-veg</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">Add ons</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">Tags</TableCell>
                            <TableCell style={{ fontSize: '20px' }} align="center">
                            {" "}
                                <Button onClick={onSortByRating}>
                                {sortByRating ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Button>
                                Rating
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filteredMenu).map((user, ind) => {
                        if (((lower === '' || lower === undefined) || (Number(user.Price) >= Number(lower))) && 
                            ((upper === '' || upper === undefined) || (Number(user.Price) <= Number(upper))) && 
                            ((user.Tags & filterTagSet) === filterTagSet) &&
                            (filterVeg === 2 || (Number(user.Veg) === filterVeg)) &&
                            (filterShops.length === 0 || ((filterShops.indexOf(user.ShopName)) > -1))) {
                                return (<>
                            <TableRow key={ind} style={{backgroundColor:'#FEFEFA' , fontSize:'20px'}} align="center">
                            <TableCell style={{ fontSize: '15px' }}  align="center">{ind + 1}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{user.Name}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{user.ShopName}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{user.Price}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{user.Veg ? 'Veg' : 'Non-veg'}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{ user.AddOns.map((addOn) => (
                                <Chip label={ADD_ONS[addOn.Name] + ': ₹' + addOn.Price} variant='outlined'/>
                                )) }</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{getTags(user.Tags).map((tag) => (<Chip label={tag} variant='outlined' />))}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">{user.Rating}</TableCell>
                            <TableCell style={{ fontSize: '15px' }}  align="center">
                                <Button variant="contained"  onClick={() => {
                                    setChips((user.AddOns).map((addOn) => `${ADD_ONS[addOn.Name]}: ₹${addOn.Price}`));
                                    setCurrOrder({food: user, quantity: 0});
                                    setOpen(true);
                                }} style={{background:"black"}}>
                                    Buy item
                                </Button>
                            </TableCell>
                        </TableRow></>);}
                        })}
                    </TableBody>
                </Table>
                <div>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Place order</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Buy Now!!!
                    </DialogContentText>
                    <Grid container align={'center'} spacing={2}
                        >
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Food item name'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.Name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Shop'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.ShopName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size='small'
                                label='Price'
                                InputProps={{readOnly: true}}
                                defaultValue={currOrder.food.Price}
                            />
                        </Grid>
                        <Grid item xs={12}><MutliSelectChip addONList={chips}/></Grid>
                        <Grid item xs={12}>
                            <Typography  gutterBottom>
                                Quantity
                            </Typography>
                            <Input
                                value={currOrder.quantity}
                                onChange={changeQuantity}
                                size="small"
                                    inputProps={{
                                    step: 1,
                                    min: 0,
                                    max: 10,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6'  gutterBottom>
                                Order Total: ₹{(currOrder.food.Price + (addON.map((a) => Number((a.split('₹'))[1])).reduce((prev, curr) => (prev + curr), 0))) * currOrder.quantity}
                            </Typography>
                        </Grid>

                    </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddToCart}>Add to Cart</Button>
                    </DialogActions>
                </Dialog>
                </div>
          </Paper>
          </Grid>
        </Grid>
    </div>
    </div>
  );
};

export default BuyerFoodMenu;
