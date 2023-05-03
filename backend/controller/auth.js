const jwt = require("jsonwebtoken")

const Auth = async(req,res,next) => {
    try {
        const token = req.get("authorization")
        // console.log("jwt",token.split(' ')[1])
        // if(!token) 
        // {
        //     console.log("why")
        //     res.send("There is no token")
        // }

        // const jwtSecret = req.originalUri.includes('refresh') ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
        // console.log(jwtSecret)/
        // console.log("refresh",token)
        // console.log(process.env.REFRESH_TOKEN_SECRET)
        jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (err,user) => {
            console.log("reached refresh stage")
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