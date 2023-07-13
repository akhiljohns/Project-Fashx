const express = require('express');
const router = express.Router();


// importing controllers
const loginController = require('../controllers/user-controllers/login-controller')
const passwordController = require('../controllers/user-controllers/password-controller')
const pageController = require('../controllers/user-controllers/page-controller')
const registerController = require('../controllers/user-controllers/register-controller')
const userController = require('../controllers/user-controllers/user-controller')
const productManage = require('../controllers/user-controllers/product-controller');
const cartController = require('../controllers/product-controllers/cart-controllers');
const orderController = require('../controllers/user-controllers/order-controller');
const profileManager = require('../controllers/user-controllers/profile-manager');

// importing middlewares
const access = require('../middlewares/loginCheck');


//requiring multer middleware
const upload = require('../middlewares/multer');


// GET PAGES 
router.get('/', access.check, access.checkBlockedStatus, userController.getHome) 
  


router.get('/tracking',access.check, access.checkBlockedStatus, pageController.getTracking);

router.get('/contact',access.check, access.checkBlockedStatus, pageController.getContact);

router.get("/products", access.check, access.checkBlockedStatus, productManage.showProducts );


router.get('/elements', access.check, access.checkBlockedStatus, access.checkBlockedStatus, pageController.getElements);


// PRODUCTS 
router.get('/single-product/:id', access.check, access.checkBlockedStatus, productManage.getSinPro);

// router.get('/signin', access.logStatus, pageController.getSignin)

// SIGNIN
router.get('/signin', access.logStatus, loginController.getLogin)
router.post('/signin', loginController.postLogin)

// SIGNUP
router.get('/signup', registerController.getSignup)
router.post('/signup', registerController.postSignup)
router.post('/checkuser', registerController.postCheckNum)
router.post('/signupvalidation', registerController.signupValidation)
router.get('/signup/otpform', registerController.getSignupotp)
router.post('/verifySignotp', registerController.verifyOtpsignup)


// LOGOUT
router.get('/logout', userController.getLogout)

// OTP
router.get('/forgotpassword', passwordController.getForgotPassword )
router.post('/checkphone', passwordController.postForgotPassword )
router.post('/verifyotp', passwordController.verifyOtp )
router.get('/resetpassword', passwordController.getResetPassword )
router.post('/resetpass', passwordController.updatePassword )


// CART 
router.get('/cart', access.check, access.checkBlockedStatus, cartController.showCart)
router.post('/addtocart', cartController.addtoCart);
router.post('/removeFromCart', cartController.removeItem );


router.post('/getQuantity', productManage.getStock);

// Function to ADD and REDUCE to the quantity of the products by one i database.
router.post('/addQuantity', cartController.addQuantity);
router.post('/reduceQuantity', cartController.reduceQuantity);


// CHECKOUT 
router.get('/checkout', access.check, access.checkBlockedStatus,orderController.showAddress);


// PROFILE 
router.get('/profile', access.check, access.checkBlockedStatus, userController.getProfile);

router.post('/updateProfile', access.check, access.checkBlockedStatus, profileManager.updateProfile );

// ADDRESS 
router.post('/addAddress', access.check, access.checkBlockedStatus, profileManager.addAddress);
router.get('/deleteAddress/:id', access.check, access.checkBlockedStatus, profileManager.deleteAddress);

// PASSWORD 

router.post('/check-password', passwordController.checkPassword )

router.post('/updatePassword', passwordController.changePassword)

module.exports = router;









































// router.get('/profile/overview', access.check, access.checkBlockedStatus, pageController.getOverview);
// router.get('/profile/edit', access.check, access.checkBlockedStatus, pageController.getProfEdit);
// router.get('/profile/address', access.check, access.checkBlockedStatus, pageController.getAddress);
// router.get('/profile/password', access.check, access.checkBlockedStatus, pageController.getChangePass);
  