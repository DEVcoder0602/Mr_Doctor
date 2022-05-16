const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/Mr_doctor";

const connectToMongo = () => {
    mongoose.connect(mongoURI , ()=>{
     
        console.log("Connected to mongo successfully");
        
    })
}

module.exports = connectToMongo;