const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    googleId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    patientID: {
        type: String
    }
});

module.exports = {
    User: mongoose.model('users', UserSchema)
}