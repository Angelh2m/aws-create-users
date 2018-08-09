'use strict';
const serverless = require('serverless-http');
const express = require('express')
const app = express();

const { keys } = require('./keys');
const { User } = require('./schemas/User');
const { Patient } = require('./schemas/Patient');

const mongoose = require('mongoose');
const passport = require('passport');

/* *
 *  PASSPORT STRATEGIES
 */
app.use(passport.initialize());
require('./config/passport')(passport);
require('./config/passport-google')(passport);

/* *
 *  Connect to MongoDB
 */
mongoose.connect(keys.mongoURL, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => err);

/* *
 *  Use the express.json instead of bodyparser
 */
app.use(express.urlencoded({ extended: true }));


/* *
 *  @ Get the patients information 
 *  @ When user logs in they shoud hit this route to display their data
 *  -> INITIAL ROUTE WHEN GETTING INTO DASHBOARD
 */
app.get('/patient', passport.authenticate('jwt', { session: false }), (req, res) => {

    Patient.findOne({ _id: req.user.patientID })
        .populate('userID', '')
        .then((user) => {
            res.json(user)
        })
        .catch(err => err);

});



/* *
 *  @ Post Create a new patient
 *  @ When user pays we assign a new Patient's ID
 *  -> ROUTE TO SEND THEM FOR THE FIRT TIME WHEN SIGNING UP
 */

app.put('/user', passport.authenticate('jwt', { session: false }), (req, res) => {

        req.user.password = ":)";

        /* *
         *  If user is already a patient
         */
        if (req.user.patientID) {
            res.status(200).json({
                ok: true,
                message: `Patient has already signed up`,
                info: `His id is:  ${req.user.patientID}`,
                USER: req.user
            });
        }

        /* *
         *  If user is not a patient. He has paid so lets convert it!
         */

        if (!req.user.patientID) {
            //   Create a new patient linked to the User
            const signupPatient = new Patient({
                userID: req.user._id,
                address: {
                    street: 'Street name',
                    number: '12',
                    city: 'NY',
                    State: 'Brooklyn',
                    Country: 'Usa',
                    Zip: '11225'
                }
            });

            // Save the new converted patient
            signupPatient.save()
                .then((savedPatient) => {
                    // LEt's also update the USER with his PATIENT ID 
                    User.findOne({ _id: savedPatient.userID })
                        .then((user) => {
                            user.patientID = savedPatient._id;
                            user.save()
                                .then((obj) => res.status(200).json(obj))
                                .catch(err => err);
                        }).catch(err => err);
                })
                .catch(err => err);
        }
    }

);




module.exports.handler = serverless(app);


const port = process.env.PORT || 6100;

app.listen(port, () => {
    console.log('Server Running');
});