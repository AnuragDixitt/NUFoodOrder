const express = require("express");
const Router = express.Router();
// Load User model
const User = require("../models/Users");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const auth = require("../controller/auth.js")
require("dotenv").config();

function LoginController() {

    
    this.getAll = async function(req, res) {
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
                    res.json({OpeningTime: new Date(users.OpeningTime), ClosingTime: new Date(users.ClosingTime)});
                }
            });
        }
    }
    

    this.register = async (req, res) => {
        const registerData = req.body;
    
        const existingUser = await User.findOne({ Email: registerData.Email});
        if (existingUser)
            return res.json(1);
        
        const salt = await bcrypt.genSalt();
        const Password = await bcrypt.hash(registerData.Password, salt);
    
        if (registerData.userStatus === 'Vendor') {
            const newUser = new User({
                Name: registerData.Name,
                Email: registerData.Email,
                date: registerData.date,
                Password: Password,
                ContactNo: registerData.ContactNo,
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
    }
    
    this.google = async(req,res) => {
        const Email  = req.body.email;
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
                    const token = jwt.sign({email : users.Email}, process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10s"});
                    const refreshToken = jwt.sign({email : users.Email}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:"10s"});
                    res.json({user: restofParams, token,refreshToken});
    
                } 
            }
        )
    }

    this.login = async (req, res) => {
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
                respo.code = 0
                respo.user= null
                respo.type = null
                res.json(respo);
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
    }

    this.edit = async (req, res) => {
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
                        res.status(200).send("OK");
                    }
                });
        } else {
            
            const user = req.body.user;
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
                            res.status(200).send("OK");
                        }
                    }
                );
            }
        }
    }


}

const loginController = new LoginController()

module.exports = loginController