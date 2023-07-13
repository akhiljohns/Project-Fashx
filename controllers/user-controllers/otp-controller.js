const dotenv = require('dotenv');
dotenv.config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceid = process.env.TWILIO_SERVICE_ID;

const countryCode = '+91';

module.exports ={

    
    resendOtp: (req, res) => {
        userData = req.query;
        otpMethods.sendOtp(userData);
        console.log('userData : '+userData.phone);
        res.json({status: true})
       
    },

    sendOtp: (userData) => {
        return new Promise((resolve, reject) => {
            client.verify.v2.services(serviceid)
                .verifications
                .create({to: countryCode+userData.phone, channel: 'sms'})
                .then((verification) => {
                    console.log(verification.status);
                    resolve(verification.status);
                    console.log(countryCode+userData.phone)
                }).catch((error) => {
                    console.log(error.message);
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
                console.log(verification_check.status);
                resolve(verification_check.valid)
            }).catch((error) => {
                console.log(error.message);
            });
        })
    },
}

