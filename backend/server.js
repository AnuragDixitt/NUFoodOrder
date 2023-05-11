// require = import
const express = require('express');
require("dotenv").config();

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000


var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var foodItemRouter = require("./routes/food");
var orderRouter = require("./routes/order");
const cookieParser = require('cookie-parser');
const paymentRoute = require("./routes/paymentRoutes");




app.use(cookieParser());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => console.log("MongoDB database connection established successfully !"))
        .catch((err) => console.log(err));

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/food", foodItemRouter);
app.use("/order", orderRouter);
app.use("/api", paymentRoute);



app.get("/api/getkey", (req, res) =>
  res.status(200).json({ key: process.env.KEY_ID })
);


// checks if the server is established the specified PORT number
app.listen(process.env.PORT, function() {
    console.log("Server is running on Port: " + process.env.PORT);
});
