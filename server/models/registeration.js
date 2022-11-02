const mongoose = require('mongoose');

var registeration = new mongoose.Schema({
    firstName: String,
    lastName: String,
    memberType: {
        type: String,
        enum: ['Player', 'Spectator'],
        default: 'Player'
    },
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