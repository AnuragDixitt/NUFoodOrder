const router = require('express').Router();
const passport = require("passport")
const CLIENT_URL = "http://localhost:3000/"

// Auth logout

router.get("/home", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successfull",
            user: req.user,
            // cookies: req.cookies
        });
    }
    
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    });
})


router.get('/logout', (req, res) => {
    // Handle with passport
    res.logout();
    res.redirect(CLIENT_URL);
})


// Auth  with google 
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));
router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/auth/google/success", 
    failureRedirect: "/login/failed"
}));

router.get("/google/success", (req, res,next) => {
    // console.log(req)
    if (req.user) {
        console.log(req.user._id)
        if (req.user.userStatus === "Vendor") {
            // console.log("achaaaaaaa",req.user)
            // next();
            // res.redirect('/vendor')
            profile = req.user
            console.log(profile)
            res.cookie('usercookie',req.user._id)
            res.send(req.user)
            // next()
            // res.redirect('http://localhost:4000/vendor/' + req.user._id)
            // res.json(req.user)

        } else {
            console.log("awdawdawdwad")
            // next();
            // res.redirect('/buyer')

            res.json(req.user)
            // router.get('http://localhost:4000/buyer' + req.user._id)
            // res.redirect(CLIENT_URL+"buyer"+req.user._id);
        }
    } else {
        res.redirect("/");
    }
});


// router.get("/googlelogin", async (req, res) => {
// 	const Email = req.body.Email;
//     // const Password = req.body.Password;
//     console.log(req.body,"idhar naye waale mei")

//     res.json(req.body)
//     // let respo = {
//     //     code: 0,
//     //     user: null,
//     //     type: ''
//     // };  
// 	// Find user by email
//     // User.findOne({ Email })
//     // .then(async (users) => {
//     //     if (!users) {
//     //         res.json(respo);
//     //     } else {
//     //         res.json(respo);
//     //     }
//     // })
//     // .catch (err => res.status(500).json({errMsg: err.message}));
// });


module.exports = router;