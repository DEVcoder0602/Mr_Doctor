const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_Secret = "Imabadb$oy";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required

router.post(
  "/createuser",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password length must contain min 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //If there are errors , return bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "This is email already exists" });
      }
      // Create a new user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authTokken = jwt.sign(data, JWT_Secret);
      console.log(authTokken);

      res.json({authTokken});
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({
      //     error: "Please enter a unique value for email",
      //     message: err.message,
      //   });
      // });

      // res.send(req.body);
    } catch (error) {
      // Catch errors
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

  // If there are errors, return Bad request and the errors

  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error: "Please try to login with correct credentials"});
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare){
      return res.status(400).json({error: "Please try to login with correct credentials"});
    }

    const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_Secret );
    res.json({authtoken})

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  } 

})

module.exports = router;
