const { Schema, model } = require("mongoose")

const  otpSchema = new Schema({

    email:String,
    code:String,
    expireIn:Number

},{
    timestamps: true
});

let otp = model('otp', otpSchema);


module.exports = otp;