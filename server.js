const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const authRouters = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/authMiddleware");

const cors = require("cors");


require("dotenv").config();


const app = express();

//Parse Json 
app.use(express.json());

// Now the Session Middleware

app.use(
    session({
        secret : process.env.SESSION_SECRET,
        resave : false ,
        saveUninitialized: false ,
        store:MongoStore.create({
            mongoUrl : process.env.MONGO_URI,
            collectionName : "sessions",
        }),

        cookie :{
            httpOnly: true,
            secure : false, 
            sameSite: "lax",
            maxAge : 1000*60*60
        }
    })
)


app.use(cors({
    origin : "http://localhost:5173",
    credentials: true 
}));

app.use("/api/auth" , authRouters); 





//test route 
app.use("/" ,(req , res) =>{
    res.send("Authentication Server is running");
} )



mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    console.log("Database:", mongoose.connection.name);

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})



