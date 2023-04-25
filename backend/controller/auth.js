const jwt = require("jsonwebtoken")

const Auth = async(req,res,next) => {
    try {
        const token = req.get("authorization")
        if(!token) res.send("There is no token")
        const jwtSecret = req.originalUri.includes('refresh') ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
        jwt.verify(token.split('')[1], jwtSecret, (err,user) => {
            if (err && err.message ==="TokenExpiredError") return res.send("Toke Expired")
            if (err ) return res.send("Invalid Token")
            return res.send(user)
            req.user = user
            next()
        })
    } catch (error) {
        res.send("Unauthorized")
    }
}

module.exports = Auth