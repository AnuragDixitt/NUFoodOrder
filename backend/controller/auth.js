const jwt = require("jsonwebtoken")

const Auth = async(req,res,next) => {
    try {
        const token = req.get("authorization")
        const secret = req.originalUrl.includes('refresh') ? "MYREFRESHTOKENSECRET" : "MYSECRETACCESS"

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