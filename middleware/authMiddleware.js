const authMiddleware = (req , res , next)=>{
    if(!req.session.userId){
        return res.status(401).json({
            message: "Unautharized please login"
        });
    }

    // authenticated can go tho the next handeler

    next();
};

module.exports= authMiddleware ;