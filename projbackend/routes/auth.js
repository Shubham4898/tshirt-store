var express = require("express");
var router = express.Router();
const {check}  = require("express-validator");
const {signup,signout,signin,isSignedIn} = require("../controllers/auth");

router.post("/signup",[
    check("name","name should be at least 3 char").isLength({min:3}),
    check("email","email is required").isEmail()

],signup);

router.post("/signin",[
    check("password","password required").isLength({min:1}),
    check("email","email is required").isEmail()

],signin);

router.get("/testroute",isSignedIn,(req,res) =>{
    res.send("A protected route");
})

router.get("/signout",signout); 

module.exports = router;