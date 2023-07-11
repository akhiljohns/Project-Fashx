const session = require('express-session')
const loginHelper = require('../../helpers/user-helpers/login-helper');
const userHelper = require('../../helpers/admin-helpers/user-helper');

module.exports ={

    getHome:(req, res, next) =>{

        res.render('user/index', {user: req.session.user});

    },

    getLogout:(req, res) =>
    {
        
        req.session.userloggedIn = false;
        const userloggedIn = req.session.userloggedIn
        const user = req.session.user
        loginHelper.setActiveStatus(user,userloggedIn);
        res.redirect('/signin');
        req.session.user = null;

        console.log("USER LOGOUT")
    },
    getProfile: async (req, res, next) => {
        try {
            const customer = user = req.session.user;
            const userAddress = await userHelper.getAddress(user._id);
            if(userAddress){
                let address = userAddress.address;
                res.render('user/profile', { user, customer, address });
            } else {
                res.render('user/profile', { user, customer,});
            }
        } catch (err) {
            console.log('Error fetching address'+err);
        }
    }


}