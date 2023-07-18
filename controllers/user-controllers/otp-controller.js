const dotenv = require('dotenv');
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceid = process.env.TWILIO_SERVICE_ID;

const countryCode = '+91';

let sentTime
let currentTime

module.exports ={

    

    sendOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviceid)
                .verifications
                .create({to: countryCode+userData.phone, channel: 'sms'})
                .then((verification) => {
                    console.log("SEND OTP STATUS:",verification.status);
                    console.log("SEND OTP DATA:",countryCode+userData.phone)
                    resolve(verification.status);
                }).catch((error) => {
                   resolve(false)
                    console.log("INVALID NUMBER",error.message);
                })
        })
    },

    verifyOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviceid)
            .verificationChecks
            .create({ to: countryCode+userData.phone, code: userData.otp })
            .then((verification_check) =>{ 
                console.log(userData.otp);
                console.log("twilio verification status",verification_check.status);
                resolve(verification_check.valid)
            }).catch((error) => {
                console.log("twilio verify error",error.message);
            });
        })
    },
}

