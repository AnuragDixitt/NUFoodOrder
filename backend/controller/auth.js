const jwt = require("jsonwebtoken")
require("dotenv").config();

const Auth = async(req,res,next) => {
    try {
        const token = req.get("authorization")
        const secret = req.originalUrl.includes('refresh') ? process.env.REFRESH_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET

        jwt.verify(token.split(' ')[1], secret, (err,user) => {
            
            if (err && err.name ==="TokenExpiredError") 
            {
                return res.status(403).send("Token Expired")
            }
            if (err) {
                return res.status(401).send("Invalid Token")
            }
            req.user = user
            next()
                  
        })
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = Auth