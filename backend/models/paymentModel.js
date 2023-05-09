const { Schema, model } = require("mongoose")

const paymentSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  amount : {
    type: Number,
    required: true
  },
  vendor : {
    type: String,
    required: true
  }
});

payment = model("Payment", paymentSchema);
// export const Payment = mongoose.model("Payment", paymentSchema);
module.exports = payment 
