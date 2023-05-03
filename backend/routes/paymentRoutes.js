const express = require('express');
const {checkout, paymentVerification} = require("./paymentController.js");

const Router = express.Router();

Router.route("/checkout").post(checkout);

Router.route("/paymentverification").post(paymentVerification);

module.exports = Router