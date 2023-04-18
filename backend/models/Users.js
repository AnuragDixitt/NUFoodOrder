const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	Name: {
		type: String,
        required: false
    },
	Email: {
		type: String,
        required: false
    },
	date:{
		type: Date,
        required: false
    },
    Password: { 
        type: String, 
        required: false
    }, 
    ContactNo: { 
        type: Number, 
        required: false
    }, 

    userStatus: {
        type: String,
        required: false
    },

    Age: { 
        type: Number,
        required: false
    },
	BatchName: { 
		type: String,
        required: false
    },

	ShopName: { 
		type: String,
        required: false
    },
	OpeningTime: { 
		type: Date, 
        required: false
    },
	ClosingTime: { 
		type: Date, 
        required: false
    },
    Wallet: { 
        type: Number, 
        required: false
    }
});

module.exports = User = mongoose.model("Users", UserSchema);
