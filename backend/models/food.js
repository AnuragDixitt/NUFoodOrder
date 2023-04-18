const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TAGS = ["Beverage", "Hot", "Cold", "Meal", "Snacks", "Spicy", "Very spicy", "Sweet", "Dessert", "Vegan"]
const ADD_ONS = ["Cheese", "Butter", "Ketchup", "Schezwan", "Mayonnaise", "Mustard", "Peri peri", "Chocolate", "Milkmaid", "Garlic dip"]

const addOnSchema = new Schema({
    Name: {type: Number}, 
    Price: {type: Number, default: 0}
}, { _id : false });


// Create Schema
const foodItemSchema = new Schema({
	Name: {
		type: String,
        required: false
    },
    Price: { 
        type: Number, 
        required: false
    },
    Rating: {
        type: Number  
    },
    Veg: { 
        type: Boolean,
        required: false,
        default: true
    },
    AddOns: [addOnSchema],
    Tags: {
        type: Number,
        default: 0
    },
    VendorID: {
        type: Schema.Types.ObjectId,
        required: false
    },
    VendorName: {type: String },
    ShopName: {
        type: String,
        required: false
    },
    CanteenOpeningTime: {
        type: Date    
    }, 
    CanteenClosingTime: {
        type: Date
    },
    BuyersRated: {type: Number, default: 0}
});

module.exports = {
    TAGS: TAGS, 
    ADD_ONS: ADD_ONS,
    foodItem: mongoose.model("foodItem", foodItemSchema)
}

