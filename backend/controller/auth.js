const jwt = require("jsonwebtoken")

const Auth = async(req,res,next) => {
    try {
        const token = req.get("authorization")
        if(!token) res.send("There is no token")
        const jwtSecret = req.originalUri.includes('refresh') ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
        jwt.verify(token.split('')[1], jwtSecret, (err,user) => {
            if (err && err?.name ==="TokenExpiredError") return res.status(403).send("Token Expired")
            if (err ) return res.send("Invalid Token")
            req.user = user
            next()
            return res.send(user)
            
        })
    } catch (error) {
        res.send({msg:"UnAuthorized"})
    }
}

module.exports = Auth