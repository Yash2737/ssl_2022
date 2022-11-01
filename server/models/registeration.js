const mongoose = require('mongoose');

var registeration = new mongoose.Schema({
    name: String,
    emailId: String,
    mobileNo: String,
    sabha: {
        type: String,
        enum: ['Kurla', 'Mulund', 'Badlapur', 'Ghatkopar-East', 'Asalpha', 'Thane', 'Chirag Nagar', 'Vikhroli', 'Sarovdaya']
    },
    sports: [String],
    sequence: Number,
}, { timestamps: true });

module.exports = mongoose.model("registeration", registeration);