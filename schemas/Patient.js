const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    address: {
        street: String,
        number: String,
        city: String,
        State: String,
        Country: String,
        zip: String
    },
    medicalHistory: {
        diabetes: String,
    },
    payment: {
        membership: [{
            plan: String,
            date: {
                type: Date,
                default: Date.now
            }
        }],
        surgery: [{
            name: String,
            date: {
                type: Date,
                default: Date.now
            }
        }]

    }
});

module.exports = {
    Patient: mongoose.model('patients', UserSchema)
}