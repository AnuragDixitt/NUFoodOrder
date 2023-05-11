
const User = require("../models/Users");

function AuthController() {

    const bcrypt = require("bcrypt");
    const nodemailer = require('nodemailer');
    const Otp = require('../models/otp');

    this.changePassword = async (req,res) => {
        var data = await Otp.find({email:req.body.Email,code:req.body.OTP});
        data = data[0]
        const response = {}
        if (data == undefined){
            response.message = 'Invalid OTP!!';
            response.status = 3;
            res.json(response)
            return
        }
        else{
        
            if (data){
                let currentTime = new Date().getTime();
                let diff = data.expireIn - currentTime;
                if(diff<0){
                    response.message = 'OTP Expired';
                    response.status = 0;
                    res.status(200).json(response)
                }else{
                    email = data.email
                    User.findOne({Email:email}).then(async (users) => {
                        const salt = await bcrypt.genSalt();
                        const pass = await bcrypt.hash(req.body.Password, salt);
                        users.Password = pass
                        users.save()
                        response.message = 'Password Changed Successfully';
                        response.status = 1;
                        res.status(200).json(response)
                    }).catch((err)=>{
                        response.message = 'Something went wrong!!';
                        response.status = 2;
                        res.json(response)
                    })
                }
            }
        }
            
    }
    

    this.emailSend = async (req,res) => {
    const response = {};
    email = req.body.Email
   
    
        await User.findOne({Email:email}).then(async (users) => {
            if (users === null){
                response.status = 0
                response.message = "Email Not Found"
                res.json(response)
            }
            else{
        let otpcode = Math.floor((Math.random()*10000+1));
        let otpData = new Otp({
            email: email,
            code: otpcode,
            expireIn: new Date().getTime() + 120*1000
        })
        let otpResponse = await otpData.save();
        mailer(email,otpData.code);
        
        response.message = 'Mail sent'
        response.status = 1
        res.status(200).json(response)
    }
    
    }).catch( (err) => {
        response.message = 'Somthing went wrong';
        response.status = 2;
        res.json(response)
    });
        
    
    }

    const mailer = (email,otp) => {

        var transporter = nodemailer.createTransport({
            service: 'gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD
            }
        });
        
        var mailOptions = {
            from: process.env.MAIL,
            to: `${email}`,
            subject: 'Reset password LINK',
            text: 'Reset your password using this OTP: ' + `${otp}`
        };

        transporter.sendMail(mailOptions, function(err,info){
            if(err){
                console.log(err);

            }
            else{
                console.log('Email sent');
            };
        });
    };


}

const authController = new AuthController()

module.exports = authController
