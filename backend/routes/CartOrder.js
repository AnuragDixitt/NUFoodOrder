var express = require("express");
var Router = express.Router();
const order = require('../models/cartOrder');

// Add food item
Router.post('/', async (req, res) => {
    try {
        const Order = req.body;
        const newOrder = new order({
        foodItem: Order.foodItem,
        VendorID: Order.VendorID,
        BuyerEmail: Order.BuyerEmail,
        BuyerID: Order.BuyerID,
        VendorName: Order.VendorName,
        buyerAge: Order.buyerAge,
        buyerBatch: Order.buyerBatch,
        Quantity: Order.Quantity,
        AddOns: Order.AddOns,
        Veg: Order.Veg,
        Total: Order.Total,
        Rating: Order.Rating,
        date: Order.date,
        Status: Order.Status 
    });
        newOrder
        .save()
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {console.log("Logged: ", err); res.status(500).json(err); });
    }
    catch (error) {
        res.send("Server Error")
    }
})

module.exports = Router