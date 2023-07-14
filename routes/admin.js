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


router.get("/dashboard", access.logStatus,  pageController.getDashboard)
  
router.get("/signin", access.check, loginController.getSignin )

router.post("/signin", loginController.postSignin);

 
// PRODUCT ROUTES 
router.get("/add-product", access.logStatus, productController.getAddproduct);

router.post("/add-product",  upload.array('productImage'), productController.postAddproduct);

router.get("/products", access.logStatus, productManage.showProducts );

router.get('/products/edit/:id', access.logStatus, productManage.getEditProduct );

router.post('/products/edit/:id', upload.array('productImage'), productManage.postEditProduct );

router.get("/products/delete/:id", access.logStatus, productManage.softDeleteProduct);
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

router.get("/admin-logout", loginController.getLogout);

router.get("/orders", loginController.getOrders);

router.get("/useredit", loginController.getUserEdit);
router.get("/userdetails", loginController.getUserDetails);






module.exports = router;
