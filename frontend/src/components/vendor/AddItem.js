import { useState } from "react";
import axios from "axios";
import React from 'react';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Button from "@mui/material/Button";
import { lightBlue } from "@mui/material/colors";

const TAGS = [
  "Beverage",
  "Hot",
  "Cold",
  "Meal",
  "Snacks",
  "Spicy",
  "Very spicy",
  "Sweet",
  "Dessert",
  "Vegan",
];

const ADD_ONS = [
  "Cheese",
  "Butter",
  "Ketchup",
  "Schezwan",
  "Mayonnaise",
  "Mustard",
  "Peri peri",
  "Chocolate",
  "Milkmaid",
  "Garlic dip",
];

const indices = new Array(10).fill().map((_, idx) => idx);

const AddFoodItem = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userID = user._id;
  const ShopName = user.ShopName;

  const [Name, setName] = useState("");
  const [Price, setPrice] = useState(0);
  const [Rating, setRating] = useState(0);
  const [Veg, setVeg] = useState(true);

  const [addOnBool, setAddOnBool] = useState(new Array(10).fill(false));
  const [addOnPrice, setAddOnPrice] = useState(new Array(10).fill(0));

  const [tagBool, setTagBool] = useState(new Array(10).fill(false));

  const handleChangeTagBool = (idx) => (event) => {
    const tmp = [...tagBool];
    tmp[idx] = event.target.checked;
    setTagBool(tmp);
  };

  const onChangeVeg = (e) => {
    setVeg(!e.target.value);
  };

  const handleChangeBool = (idx) => (event) => {
    const tmp = [...addOnBool];
    tmp[idx] = event.target.checked;
    setAddOnBool(tmp);
  };

  const handleChangePrice = (idx) => (event) => {
    const tmp = [...addOnPrice];
    tmp[idx] = event.target.value;
    setAddOnPrice(tmp);
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const onAddFoodItem = (event) => {
    event.preventDefault();

    let tagSet = 0 >>> 0;

    let addOnList = [];
    indices.forEach((i) => {
      if (tagBool[i]) tagSet = tagSet | (1 << i);
      if (addOnBool[i])
        addOnList.push({ Name: i, Price: addOnPrice[i] });
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
      BuyersRated: 0,
    };
    axios
      .post("http://localhost:4000/food/insert-item", newItem)
      .then((response) => {
        alert(
          "Added food item, " + response.data.Name + " to your menu."
        );
      })
      .catch((err) => console.log(err.response.data.errMsg));
  };

  return (
    <div style={{backgroundColor: "lightBlue" , height: "100vh", paddingTop: 150}} >
      <React.Fragment>
        <Paper sx={{ overflow: "hidden", maxWidth: 900, margin: "auto", borderRadius: "15px 15px" , }}>
          <Box sx={{ flexGrow: 1 }}>
            <Toolbar>
              <Typography variant="h6" component="div">
                Add food item
              </Typography>
            </Toolbar>
            <Grid container spacing={2} sx={{ p: 5 }}>
              <Grid item xs={4}>
                <TextField
                  required
                  fullWidth
                  id="Name"
                  name="Name"
                  label="Name"
                  value={Name}
                  onChange={onChangeName}
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  required
                  fullWidth
                  id="Price"
                  name="Price"
                  label="Price"
                  type="number"
                  value={Price}
                  onChange={onChangePrice}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup
                    row
                    aria-label="type"
                    defaultValue="veg"
                    onChange={onChangeVeg}
                  >
                    <FormControlLabel
                      value="veg"
                      control={<Radio />}
                      label="Veg"
                    />
                    <FormControlLabel
                      value="nonveg"
                      control={<Radio />}
                      label="Non-veg"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Add-ons</FormLabel>
                  <FormGroup>
              <Grid container spacing={2}>
                {[ADD_ONS.slice(0, 5), ADD_ONS.slice(5, 10)].map((addOnGroup, groupIdx) => (
                  <Grid
                    item
                    key={groupIdx}
                    xs={6}
                    sx={{
                      marginBottom: "32px",
                      "& > *:not(:last-child)": {
                        marginBottom: "16px",
                      },
                    }}
                  >
                    {addOnGroup.map((addOn, idx) => (
                      <React.Fragment key={idx}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addOnBool[idx + groupIdx * 5]}
                              onChange={handleChangeBool(idx + groupIdx * 5)}
                              name={addOn}
                              color="primary"
                            />
                          }
                          label={addOn}
                          sx={{ mr: 2 }}
                        />
                        <TextField
                          id="outlined-number"
                          label="Price"
                          type="number"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={addOnPrice[idx + groupIdx * 5]}
                          onChange={handleChangePrice(idx + groupIdx * 5)}
                          disabled={!addOnBool[idx + groupIdx * 5]}
                          size="small"
                          sx={{ ml: 2 }}
                        />
                      </React.Fragment>
                    ))}
                  </Grid>
                ))}
              </Grid>
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Tags</FormLabel>
                  <FormGroup>
                    <Grid container spacing={2} justifyContent="flex-start">
                      {TAGS.map((tag, idx) => (
                        <Grid item key={idx}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={tagBool[idx]}
                                onChange={handleChangeTagBool(idx)}
                                name={tag}
                                color="primary"
                              />
                            }
                            label={tag}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid container justifyContent = "center">
              {/* <Grid item xs={12} sm={6} justifyContent = "center"> */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onAddFoodItem}
                >
                  Add item
                </Button>
              {/* </Grid> */}
            </Grid>
            </Grid>
          </Box>
        </Paper>
      </React.Fragment>
    </div>
  );
};

export default AddFoodItem;