const session = require('express-session');

module.exports = {

   adminValidation:(adminBody) =>{
        if (adminBody.username === 'ADMIN' && adminBody.password === '123') {
          return true;
         
        } else {
          return false;
        }
      }
    

}