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

router.get("/google/success", (req, res) => {
    if (req.user) {
        if (req.user.userStatus === "Vendor") {
            res.redirect(CLIENT_URL+"vendor");
        } else {
            res.redirect(CLIENT_URL+"buyer");
        }
    } else {
        res.redirect("/");
    }
});

module.exports = router;