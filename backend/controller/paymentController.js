// const instance = require('../server.js');
const crypto = require('crypto');
const Payment = require('../models/paymentModel.js');
const Razorpay = require('razorpay');
const Pay = require("../models/paymentModel.js")

var instance = new Razorpay({
  key_id: 'rzp_test_HZj6s0sFOK3SAE',
  key_secret: 'PbgO5c5PZGpBZ4CUQx4hHvLH',
});


const checkout = async (req, res) => {
  // console.log("Request recived : ", req.body);
  try {
    const options = {
      amount: Number(req.body.totalprice),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    // console.log("Order : ", order);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment'
    });
  }
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // res.redirect(
    //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    // );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

const saveDB = async (req, res) => {
    const paymentDetails = new Pay({
      razorpay_order_id : req.body.orderid,
      razorpay_payment_id: req.body.paymentid,
      razorpay_signature : req.body.signature,
      amount: req.body.amt,
      order_id : req.body.orderid
    });
    paymentDetails.save()
    .then(
      console.log("payment saved in db")
    )
    .catch(err => {
      console.log("error saving in database")
    })

}


module.exports = {
    checkout,
    paymentVerification,
    saveDB
};