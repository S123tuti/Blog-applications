const express = require('express')
const route = require ('./routes/route.js')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express()
const multer = require("multer")
 require("dotenv").config({})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(multer().any())

console.log(process.env.Mongo_Url)
mongoose.connect(process.env.Mongo_Url,{
useNewUrlParser : true
})
.then(()=>{
    console.log('MongoDB is connected')
})
.catch((err)=>{
    console.log(err) 
})


app.use('/' , route)

let PORT =  process.env.Port || 8081

app.listen(PORT , function(){
    console.log(`server is running on port ${PORT}` )
})