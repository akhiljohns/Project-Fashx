const session = require('express-session')
const loginHelper = require('../../helpers/user-helpers/login-helper');

module.exports ={

 getLogin:(req, res, next)=>{

    res.render('user/user-signin',{layout:false,logsta:false,blocked:false});

 },

 postLogin:(req, res)=>{
    loginHelper.doLogin(req.body).then((response) => {
        // console.log(response.status,response.user+"__________________");
        if (response.status) {
          let user = response.user
          if(user.blocked) {    
              console.log("USER IS BLOCKED");
          
            res.render('user/user-signin',{layout:false,blocked:true});
          }else{  
          req.session.userloggedIn = true;
          req.session.user=response.user;
          userloggedIn = true;
        
          loginHelper.setActiveStatus(user,userloggedIn);

          res.redirect('/');
        } 
      }
      else {
       
          res.render('user/user-signin',{layout:false,logsta:true});
         
        }
      });

    }
    

















}