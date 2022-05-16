const mongoose = require("mongoose");
const { Schema } = mongoose;

const AppointmentsSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
},
  doctor: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  time: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('appointment', AppointmentsSchema) ;
