const express = require("express");
const router = express.Router();
const productHelper = require("../helpers/product-helpers/product-helper");
const loginhelper = require("../helpers/admin-helpers/login-helper");
const session = require("express-session");
const access = require("../middlewares/adminlogcheck");
const upload = require('../middlewares/multer');

// IMPORTING CONTROLLERS 
const categoryController = require("../controllers/admin-controllers/category-controller")
const loginController = require("../controllers/admin-controllers/login-controller")
const pageController = require("../controllers/admin-controllers/page-controller")
const userController = require("../controllers/admin-controllers/user-controller")
const productController = require("../controllers/product-controllers/product-controller")
const productManage = require('../controllers/admin-controllers/product-management');
const userManage = require('../controllers/admin-controllers/userMang-controller');
const orderController = require('../controllers/admin-controllers/order-controller');
const couponManagement = require('../controllers/admin-controllers/coupon-management');
const bannerManagement = require('../controllers/admin-controllers/banner-management');
const salesManageController = require('../controllers/admin-controllers/sales-management');


router.get("/",(req, res, next) => { res.redirect('/admin/signin')});

router.get("/login",(req, res, next) => {res.redirect('/admin/signin')});

router.get("/signin", access.check, loginController.getSignin )
router.post("/signin", loginController.postSignin);

router.get("/dashboard", access.logStatus,  pageController.getDashboard)


 
// PRODUCT ROUTES 
router.get("/add-product", access.logStatus, productController.getAddproduct);
router.get('/add-product/cropimage',access.logStatus, productController.getCrop);

router.post("/add-product", access.logStatus, upload.array('productImage'), productController.postAddproduct);
router.post('/deleteimg', access.logStatus,productController.deleteImg);

router.get("/products", access.logStatus, productManage.showProducts );

router.get('/products/edit/:id', access.logStatus, productManage.getEditProduct );
router.delete('/admin/products/delete-image/:filename', (req, res, next) => {
    const filename = req.params.filename;
  
    // Use file system module to delete the image file
    fs.unlink(`./public/uploads/${filename}`, (err) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
  
router.post('/products/edit/:id', upload.array('productImage'), productManage.postEditProduct );

router.post("/products/delete", access.logStatus, productManage.softDeleteProduct);
router.get("/products/delete/image/:id", access.logStatus, productManage.softDeleteProduct);
router.get('/products/hide/:id',access.logStatus, productManage.hideunhideproduct);




// CATEGORY ROUTES 
router.get('/categories', access.logStatus, categoryController.allCategories);

router.post('/addCategory', access.logStatus, categoryController.addCategory);

router.get('/category/delete/:id',access.logStatus, categoryController.deleteCategory);
router.get('/category/hide/:id',access.logStatus, categoryController.hideunhide);


//USER ROUTES
router.get("/users", access.logStatus,  userController.getUsers);

router.get('/users/block/:id', access.logStatus, userManage.blockUnblockUser );
router.get('/users/delete/:id', access.logStatus, userManage.deleteUser );

router.get("/logout", access.logStatus, loginController.getLogout);


router.get("/useredit", access.logStatus, loginController.getUserEdit);
router.get("/userdetails",  access.logStatus, loginController.getUserDetails);


// ORDERS 
router.get("/orders", access.logStatus,orderController.getOrders );
router.get('/orders/details', access.logStatus, orderController.getOrderdetails);
router.post('/cancelorder', access.logStatus, orderController.CancelOrder)
router.get('/deliverorder/:order_id/:user_id', access.logStatus, orderController.deliverOrder)
router.get('/returnorder/:order_id/:user_id', access.logStatus, orderController.returnOrder)


// COUPON 

router.get('/coupon',access.logStatus, couponManagement.getCoupon);
router.post('/add-coupon', access.logStatus, couponManagement.addCoupon );
router.get('/removeCoupon',  access.logStatus,couponManagement.removeCoupon );


//banner management
router.get('/banner',access.logStatus, bannerManagement.getBanner);

router.get('/addBanner',access.logStatus, (req, res)=> { res.render('admin/addBanner',{admin:true})})

router.post('/addBanner',access.logStatus, upload.single('bannerImage'), bannerManagement.addBanner);

router.post('/removeBanner',access.logStatus, bannerManagement.removeBanner);

//SALES
router.post('/getSales', access.logStatus, salesManageController.getSales )

router.post('/getPaymentMethod', access.logStatus, salesManageController.getPaymentMethod);

router.post('/updateGraph', access.logStatus, salesManageController.salesForGraph);






module.exports = router;
