const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceid = process.env.TWILIO_SERVICE_ID;

const countryCode = '+91';

let sentTime;
let currentTime;
let timelimit = '300';

module.exports = {
  sendOtp: (userData) => {
    return new Promise((resolve, reject) => {
      client.verify.v2.services(serviceid)
        .verifications
        .create({ to: countryCode + userData.phone, channel: 'sms' })
        .then((verification) => {
          console.log("SEND OTP STATUS:", verification.status);
          console.log("SEND OTP DATA:", countryCode + userData.phone);
          if (verification.status === 'pending') {
            sentTime = Date.now() / 1000;
            console.log("OTP SENT TIME:", sentTime);
          }
          resolve(verification.status);
        })
        .catch((error) => {
          resolve(false);
          console.log("ERROR MESSAGE FROM TWILIO:", error.message);
        });
    });
  },

  verifyOtp: (userData) => {
    return new Promise((resolve, reject) => {
      client.verify.v2.services(serviceid)
        .verificationChecks
        .create({ to: countryCode + userData.phone, code: userData.otp })
        .then((verification_check) => {
          if (verification_check.status === 'approved') {
            currentTime = Date.now() / 1000;
            const timeDiffInSeconds = (currentTime - sentTime);
            console.log("-==-=-=-=-=",timeDiffInSeconds)
            if (timeDiffInSeconds > timelimit) {
                console.log('otp expired')
                
              let otpExpired = "expired";
              resolve(otpExpired);
            } else {
              console.log(userData.otp);
              console.log("Twilio verification status:", verification_check.status);
              resolve(verification_check.valid);
            }
          }
          console.log(userData.otp);
              console.log("Twilio verification status:", verification_check.status);
              resolve(verification_check.valid);
        })
        .catch((error) => {
          console.log("Twilio verify error:", error.message);
        });
    });
  },
};
