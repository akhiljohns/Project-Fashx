const express = require('express');
const loginHelper = require('../helpers/user-helpers/login-helper');
const router = express.Router();
const session = require('express-session');

// importing controllers
const loginController = require('../controllers/user-controllers/login-controller')
const passwordController = require('../controllers/user-controllers/password-controller')
const pageController = require('../controllers/user-controllers/page-controller')
const registerController = require('../controllers/user-controllers/register-controller')
const userController = require('../controllers/user-controllers/user-controller')
const productManage = require('../controllers/user-controllers/product-controller');
const cartController = require('../controllers/product-controllers/cart-controllers');

// importing middlewares
const access = require('../middlewares/loginCheck');

// GET PAGES 
router.get('/', access.check, access.checkBlockedStatus, userController.getHome) 
  


router.get('/tracking',access.check, access.checkBlockedStatus, pageController.getTracking);

router.get('/contact',access.check, access.checkBlockedStatus, pageController.getContact);

router.get("/products", access.check, access.checkBlockedStatus, productManage.showProducts );

router.get('/checkout', access.check, access.checkBlockedStatus, pageController.getCheckout);
router.get('/profile', access.check, access.checkBlockedStatus, userController.getProfile);

router.get('/elements', access.check, access.checkBlockedStatus, access.checkBlockedStatus, pageController.getElements);


// PRODUCTS 
router.get('/single-product/:id', access.check, access.checkBlockedStatus, productManage.getSinPro);

// LOGIN
router.get('/signin', access.logStatus, loginController.getLogin)
router.post('/signin', loginController.postLogin)

// SIGNUP
router.post('/signup', registerController.postSignup)
router.post('/signupvalidation', registerController.signupValidation)

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




// //check if the product with particular varient is inside the cart of the user or not
// router.post('/checkProductInCart', cartController.checkProduct);


// // Function to ADD and REDUCE to the quantity of the products by one in database.
// router.post('/addQuantity', cartController.addQuantity);
// router.post('/reduceQuantity', cartController.reduceQuantity);


// //function to remove items from cart
// router.get('/removeFromCart/:id', cartController.removeItem );


module.exports = router;
  