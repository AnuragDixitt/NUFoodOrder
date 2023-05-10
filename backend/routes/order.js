var express = require("express");
var Router = express.Router();

const order = require('../models/order');

Router.get("/", async function(req, res) {

    const VendorID = req.query.vendorid;
    const BuyerID = req.query.buyerid;
    if (VendorID !== null && VendorID !== undefined) {
        order.find({VendorID: VendorID})
            .then((orders) => res.status(200).json(orders))
            .catch(err => console.log(err));
    } else if (BuyerID !== null && BuyerID !== undefined) {
        order.find({BuyerID: BuyerID})
            .then((orders) => res.status(200).json(orders))
            .catch(err => console.log(err));
    } else {
        order.find(function(err, orders) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                res.status(200).json(orders);
            }
        });
    }
});

// Add or insert food item 
Router.post("/place", async (req, res) => {
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
        date: new Date(Order.date),
        Status: Order.Status 
    });
    newOrder
        .save()
        .then(order => {
            console.log(order);
            res.status(200).json(order);
        })
        .catch(err => {console.log("Logged: ", err); res.status(500).json(err); });
});

// Edit (change Status)
Router.post('/status', async (req, res) => {
    const Order = req.body;
    if (Order.RateOrder) {
        order.findOneAndUpdate({ _id: Order._id },
            {Rating: Order.Rating}, 
            {new: true},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.json(doc.Rating);
                }
            }
        );
    } else {
        order.findOneAndUpdate({ _id: Order._id },
            {Status: Order.Status}, 
            {new: true},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json(err);
                } else {
                    res.json(doc.foodItem);
                }
            }
        );
    }
});


module.exports = Router;

