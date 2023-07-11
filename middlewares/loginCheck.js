const session = require('express-session');
const userHelper = require("../helpers/admin-helpers/user-helper");

module.exports = {
    check: (req, res, next)=> {
        const loggedIn = req.session.userloggedIn;
        if(loggedIn) {
            next();
        } else {
            res.redirect('/signin');
        }
    },

    logStatus: (req, res, next)=> {
        const loggedIn = req.session.userloggedIn;
        if(loggedIn) {
            res.redirect('/')
        } else {
            next()
        }
    },


    checkBlockedStatus:  (req, res, next) => {
        let email;
        if(req.session.user){
            email = req.session.user.email;
        } else {
            email = req.body.email;
        }

         userHelper.findBlockStatus(email).then((response) => {
            if(response){
                if (response.blocked) {
                    console.log(response);
                    req.session.userloggedIn = false
                    req.session.user = null
                    res.render('user/user-signin',{layout:false,blocked:true});               
                } else {
                    next();
                }
            } else {
                next();
            }
        })
    }
}