const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const cartOrderSchema = new Schema({
    foodItem: {type: String},

    VendorName: {type: String},
    BuyerID: {type: Schema.Types.ObjectId},
    Quantity: {type: Number},
    AddOns: {type: String},
    Veg: {type: Boolean},
    Total: {type: Number},
    Status: {type: String},
    
    VendorID: {type: Schema.Types.ObjectId},
    buyerAge: {type: Number},
    buyerBatch: {type: String},

    Rating: {type: Number},
    date: {type: Number, default: new Date()},
}); 

module.exports = order = mongoose.model("cartOrderSchema", cartOrderSchema);
