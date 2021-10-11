const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
require('dotenv').config()

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Importing Routes
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const { noRoute } = require('./controllers/noRoute')
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

const app = express()
const cookiesParser = require('cookie-parser')

app.use(cookiesParser())


// DoteEnv
const PORT = process.env.PORT || 3000
const DB_KEY = process.env.DB_KEY

// Connection with DataBase
mongoose.connect(DB_KEY, {
    useNewUrlParser: true , 
    useUnifiedTopology: true  
})

const db = mongoose.connection

db.on('error', () => {console.log(`DataBase didn't load,happened a error!`)})
db.on('open', () => {console.log(`DataBase loaded!`)})

// Setting the EJS view
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'templates'))

// Routes
app.use('/', userRoute)
app.use('/admin', adminRoute)
app.use('*', noRoute)

// App listening

app.listen(PORT, () => {console.log(`Server running on PORT:${PORT}`)})