const express = require("express");
// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// post request to creat the user 

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //validate the fields 
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }


        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            })
        }

        //check existingUser 

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });



        if (existingUser) {

            console.log("Existing user:", existingUser);

            return res.status(409).json({
                message: "username or email already exists"
            })
        }



        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save();

        // send response

        return res.status(201).json({
            message: "User registered Sucessfully",
            User: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "username or email already existing"
            })
        }

        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        // find user by email

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(400).json({
                message: "User not Found Invalid email or Password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or Password"
            });
        }

        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({
                    message: "could not create session"
                });
            }

            //store session id

            req.session.userId = user._id.toString();

            //save session

            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Couldnot save session"
                    });
                }

                return res.status(200).json({
                    message: "Login Sucessfully",
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                })
            });
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

});


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not Found"
            });
        }

        return res.status(200).json({
            message: "User found",
            user
        })
    }catch(error){
        console.error(error);
        return res.status(500).json({
            message : "Internal Server error"
        });
    }
});


router.post("/logout" , (req,res) => {
    req.session.destroy((err)=>{
        if(err){
            console.error(err);
            return res.status(400).json({
                message: "Logout failed"
            })
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            message : "Logout Sucessfully"
        });
    });
});


module.exports = router;