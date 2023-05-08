const express = require("express");
const Router = express.Router();
// Load User model
const User = require("../models/Users");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const auth = require("../controller/auth.js")
require("dotenv").config();
const authcontroller = require("../controller/authController.js")
const loginController = require("../controller/loginController")

// GET request 
// Getting all the users
Router.get("/", loginController.getAll);


// POST request 
// Add a user to db
Router.post("/register",loginController.register);


// POST request 
Router.post("/googlelogin",loginController.google)


// Login
Router.post("/login", loginController.login);


Router.get('/refresh', auth,(req,res) => {
    try {
        const {user} = req
        const {email,iat,exp} = user
        const nowTime = Math.floor(Date.now() * 0.001)
        const newUser = {
            email: email,
            iat:nowTime,
            exp:nowTime + 10
        }
        const token =  jwt.sign(newUser,process.env.ACCESS_TOKEN_SECRET );
        return res.status(201).send(token)
    } catch (error) {
        return res.send(error)
    }
})

Router.get('/protected', auth, (req,res) => {
    try {
        return res.status(201).send("Protected Route")
    } catch (error) {
        return res.send({err})
    }
})

// EDIT profile
Router.post('/edit',loginController.edit);

Router.post('/email-send', authcontroller.emailSend)

Router.post('/reset-password', authcontroller.changePassword)

module.exports = Router;

