// require = import
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000
const MONGO_DB_URI = 'mongodb://127.0.0.1/one';

var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
var foodItemRouter = require("./routes/food");
var orderRouter = require("./routes/order");
const authRoute = require("./routes/auth-routes");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const passport = require("passport");
const app = express();

app.use(cookieSession(
    {name:"session",
    keys:["NUorder"],
    maxAge: 24 * 60 * 60 * 100,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRoute);

// Connection to MongoDB
mongoose.connect(MONGO_DB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
        .then(() => console.log("MongoDB database connection established successfully !"))
        .catch((err) => console.log(err));

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/food", foodItemRouter);
app.use("/order", orderRouter);


// checks if the server is established the specified PORT number
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
