const jwt = require("jsonwebtoken")

const Auth = async(req,res,next) => {
    try {
        jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err,user) => {
            if (err && err?.name ==="TokenExpiredError") 
            {return res.status(403).send("Token Expired")}
            if (err ) {
                return res.status(401).send("Invalid Token")
            }
            req.user = user
            next()
                  
        })
    } catch (error) {
        console.log("idhar")
        res.send({msg:"UnAuthorized"})
    }
}

module.exports = Auth