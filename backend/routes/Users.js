const express = require("express");
const Router = express.Router();
// Load User model
const User = require("../models/Users");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const auth = require("../controller/auth.js")
require("dotenv").config();
const authcontroller = require("../controller/authController.js")


// GET request 
// Getting all the users
Router.get("/", async function(req, res) {
    if (req.query.vendorid === null || req.query.vendorid === undefined) {
        if (req.query.id === null || req.query.id === undefined) {
            await User.find(function(err, users) {
                if (err) {
                    console.log(err);
                } else {
                    res.json(users);
                }
            });
        } else {
            await User.findOne({_id: req.query.id}, function(err, users) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(users);
                }
            });
        }
    } else {
        await User.findOne({_id: req.query.vendorid}, function(err, users) {
            if (err) {
                console.log(err);
            } else {
                console.log("OK");
                console.log(users);
                console.log({OpeningTime: users.OpeningTime, ClosingTime: users.ClosingTime});
                res.json({OpeningTime: new Date(users.OpeningTime), ClosingTime: new Date(users.ClosingTime)});
            }
        });
    }
});


// POST request 
// Add a user to db
Router.post("/register", async (req, res) => {
    const registerData = req.body;

    const existingUser = await User.findOne({ Email: registerData.Email});
    if (existingUser)
        return res.status(400).json({errMsg: "Account with this email already exists"});
    
    const salt = await bcrypt.genSalt();
    const Password = await bcrypt.hash(registerData.Password, salt);

    if (registerData.userStatus === 'Vendor') {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: Password,
            ContactNo: registerData.ContactNo,
            Wallet: registerData.Wallet,
            userStatus: registerData.userStatus,
            ShopName: registerData.ShopName,
            OpeningTime: registerData.OpeningTime,
            ClosingTime: registerData.ClosingTime
        });
        newUser
            .save()
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(500).json({errMsg: err.message});
            });
    } else {
        const newUser = new User({
            Name: registerData.Name,
            Email: registerData.Email,
            date: registerData.date,
            Password: Password,
            ContactNo: registerData.ContactNo,
            Wallet: registerData.Wallet,
            userStatus: registerData.userStatus,
            Age: registerData.Age,
            BatchName: registerData.BatchName
        });
        newUser.save()
            .then(user => {
                res.status(200).json(newUser);
            })
            .catch(err => {
                res.status(500).json({errMsg: err.message});
            });
    }
});

// POST request 
Router.post("/googlelogin",async(req,res) => {
    const Email  = req.body.email;
    // console.log(Email)
    // console.log(req.body.user);
    let respo = {
        code: 0,
        user: null,
        type: ''
    }

    User.findOne({ Email })
    .then(async (users) => {
        if (!users) {

            res.json({msg:respo + "User not registered"});
        } else {

                //JWT
                const {Password, ...restofParams} = users._doc
                console.log(restofParams)
                const token = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);
                const refreshToken = jwt.sign({email : users.Email}, process.env.REFRESH_TOKEN_SECRET)
                res.json({user: restofParams, token,refreshToken});

            } 
        }
    )
})

// Login
Router.post("/login", async (req, res) => {
	const Email = req.body.Email;
    const Password = req.body.Password;

    let respo = {
        code: 0,
        user: null,
        type: ''
    };  

	// Find user by email
    User.findOne({ Email })
    .then(async (users) => {
        if (!users) {

            res.json({msg:respo + "Something went wrong!"});
        } else {
            const passwordMatch = await bcrypt.compare(Password, users.Password);
            if (passwordMatch) {
                respo.code = 1;
                delete users.Password;
                respo.user = users;
                respo.type = users.userStatus;
                profile = {
                    name: users.Name,
                    email : users.Email
                }
                //JWT
                const {Password, ...restofParams} = users._doc
                const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10s"});
                const refreshToken = jwt.sign({email : users.Email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "10m"})
                res.json({user: restofParams, token,refreshToken});

            } else {
                respo.code = 2;
                res.json(respo);
            }
        }
    })
    .catch (err => res.status(500).json({errMsg: err.message}));
});

Router.post('/refresh', auth,(req,res) => {
    try {
        console.log("pahuch gaya yaha")
        const {user} = req
        // console.log(user)
        // const {Password, ...restofParams} = user._doc
        // console.log(Password)
        const token =  jwt.sign(user,process.env.ACCESS_TOKEN_SECRET );
        console.log("token")
        return res.status(201).send(token)
    } catch (error) {
        console.log("pahuch  yaha",error)
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
Router.post('/edit', async (req, res) => {
    if (req.body.changePassword) {

        const userId = req.body._id;
        const existingUser = await User.findOne({_id: userId});
        const passwordMatch = await bcrypt.compare(req.body.currPass, existingUser.Password);
        if (!passwordMatch) {
            return res.status(400).json({errMsg: "The current password field does not match your current password."});
        }

        const salt = await bcrypt.genSalt();
        const Password = await bcrypt.hash(req.body.newPassword, salt);

        User.findOneAndUpdate({_id: userId}, 
            {Password: Password}
        , {new: true}, 
            (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({errMsg: err.message});
                } else {
                    console.log(doc); 
                    res.status(200).send("OK");
                }
            });
    } else {
        if (req.body.updateWallet) {
            console.log(req.body);
            User.findOneAndUpdate({_id: req.body._id}, 
                {
                    $inc: {Wallet: req.body.increment}
                }
            , {new: true}, 
                (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({errMsg: err.message});
                    } else {
                        console.log(doc); 
                        res.status(200).send("OK");
                    }
                });
            return;
        }
        const user = req.body.user;
        console.log('UserType: ', user.userStatus);
        console.log(user);
        if (user.userStatus === 'Buyer') {
            User.findOneAndUpdate({_id: user._id}, 
            {
                Name: user.Name,
                ContactNo: user.ContactNo,
                Age: user.Age,
                BatchName: user.BatchName
            }, {new: true}, 
                (err, doc)=>{
                    if (err) {
                        console.log(err);
                        res.status(500).json({errMsg: err.message});
                    } else {
                        console.log("BUYER: ", doc); 
                        res.status(200).send("OK");
                    }
                }
            );
        } else {
            User.findOneAndUpdate({_id: user._id}, 
            {
                Name: user.Name,
                ContactNo: user.ContactNo,
                ShopName: user.ShopName,
                OpeningTime: user.OpeningTime,
                ClosingTime: user.ClosingTime
            }, {new: true}, 
                (err, doc)=>{
                    if (err) {
                        console.log(err);
                        res.status(500).json({errMsg: err.message});
                    } else {
                        console.log("VENDOR: ", doc); 
                        res.status(200).send("OK");
                    }
                }
            );
        }
    }
});

Router.post('/email-send', authcontroller.emailSend)

Router.post('/reset-password', authcontroller.changePassword)

module.exports = Router;

