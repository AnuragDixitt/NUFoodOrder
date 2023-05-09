const express = require('express');
const {checkout, paymentVerification, saveDB} = require("../controller/paymentController.js");

const Router = express.Router();

Router.route("/checkout").post(checkout);

Router.route("/paymentverification").post(paymentVerification);

Router.route("/saveinfo").post(saveDB)

module.exports = Router