const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, // Add these options for backward compatibility
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database not connected', err));

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


app.use('/' , require('./routes/authRoutes'))
const port = 8000;
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
