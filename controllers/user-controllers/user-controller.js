const session = require('express-session')
const loginHelper = require('../../helpers/user-helpers/login-helper');
const userHelper = require('../../helpers/admin-helpers/user-helper');

module.exports.passupdate = false;
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
            const userId = req.session.user._id
            const customer = user = await userHelper.findUserById(userId)
          
            const userAddress = await userHelper.getAddress(userId);
            if(userAddress){
                let address = userAddress.address;
                console.log("Address", address)
                res.render('user/profile', { user, customer, address });
            } else {
                res.render('user/profile', { user, customer,});
            }
        } catch (err) {
            console.log('Error fetching address'+err);
        }
    }
    // getProfile: async (req, res, next) => {
    //     try {
    //         const customer = user = req.session.user;
    //         const userAddress = await userHelper.getAddress(user._id);
    //         if(userAddress){
    //             let address = userAddress.address;
    //             res.render('user/profile', { user, customer, address });
    //         } else {
    //             res.render('user/profile', { user, customer,});
    //         }
    //     } catch (err) {
    //         console.log('Error fetching address'+err);
    //     }
    // }

    // getProfile: async (req, res, next) => {
    //     res.render('user/profile');
    // }

}