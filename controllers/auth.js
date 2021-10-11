const jwt = require("jsonwebtoken")
require('dotenv').config()
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const  SECRET = process.env.JWT_SECRET


const authentication = (req,res,next) => {
    let token = req.cookies.token

    if(token){
        try {
            let userVerified = jwt.verify(token,SECRET)
            res.status(200)
            next()
        } catch (error) {
            res.status(403)
            res.render('errorPage', {message:`Access denied,Login use it !`})
        }
    }else{
        res.status(403)
        res.render('errorPage', {message:`Access denied,Login to use it !`})
    }
}

module.exports = {authentication}