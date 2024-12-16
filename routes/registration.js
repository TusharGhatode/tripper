const express = require("express");
const router = new express.Router();
const userdb = require("../schemas/registration.js");

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await userdb.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        message: `User with email ${email} already exists.`,
        status: 401,
      });
    }

    const newUser = new userdb({
      fullName,
      email,
      password,
    });

    const storeData = await newUser.save();

    res.status(201).json({ status: 201, storeData });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `User with email ${email} already exists.`,
        status: 409,
      });
    } else {
      console.error("Server error: ", error);
      res.status(500).json({ error: "Server error" });
    }
  }
});




router.post('/login', async (req, res) => {
    const { email, password } = req.body;

   
    
    try {
        const existingUser = await userdb.findOne({ email });

        if (existingUser) {
            if (existingUser.password !== password) {
                return res.status(401).json({ message: "Invalid password." });
            }
            return res.status(200).json({ message: "Login successful.", data: existingUser });
        }

        // Handling when email is not found
        return res.status(404).json({ message: "Email not found." });

    } catch (error) {
        console.error(error); // Log unexpected errors
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});




module.exports = router;
