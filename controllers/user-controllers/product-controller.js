const productHelper = require("../../helpers/product-helpers/product-helper");
const categoryHelper = require("../../helpers/product-helpers/category-helper");
const carthelper = require("../../helpers/product-helpers/cart-helper");
const reviewColl = require("../../models/review-model");
module.exports = {
  showProducts: async (req, res, next) => {
    let categories = await categoryHelper.allCategory();

    productHelper.showProductsUser().then((products) => {
        if (!products.length <= 0) {
          res.render("user/products", { products, user: req.session.user ,categories});
        } else {
          products = false;
          res.render("user/products", { products, user: req.session.user ,categories});
        }
      })
      .catch((err) => {
        console.log("prd rende err", err);
      });
  },


  getSinPro: async (req, res, next) => {
    try {
      const prodid = req.params.id;
      const customerId = req.session.userloggedIn ? req.session.user._id : null;
  
      let productPurchased = false;
      let userReviewed = false; // Initialize userReviewed as false
      if (customerId) {
        const hasProduct = await productHelper.hasProductInOrder(customerId, prodid);
        if (hasProduct) {
          productPurchased = true;
          console.log('User has the product in their order.');
        }
  
        // Check if the user has already reviewed the product
        const userReview = await reviewColl.findOne({
          'userId': customerId,
          'reviews.product': prodid
        });
        if (userReview) {
          userReviewed = true;
          console.log('User has already reviewed the product.');
        }
      }
  
      const product = await productHelper.findProductByIdUser(prodid);
  
      let noStock;
      if (product.stock == '0') {
        noStock = true;
      } else {
        noStock = false;
      }
  
      const userId = req.session.userloggedIn ? req.session.user._id : null;
      const response = userId ? await carthelper.checkProduct(userId, product) : false;
  
      const reviews = await reviewColl.find({'reviews.product': prodid}).lean().exec();
        
  
      const reviewsData = reviews.length > 0 ? reviews[0].reviews : []; // Extract reviews array from the document
     
      console.log(reviewsData, "review collections");
  
      const onCart = response || false;
  
      res.render("user/single-product", {
        product,
        oncart: onCart,
        user: req.session.user,
        noStock,
        productPurchased,
        userReviewed, // Pass userReviewed to the template
        reviews: reviewsData
      });
    } catch (error) {
      console.error('Error:', error);
      res.render("error-page", { error });
    }
  },
  
  
  // getSinPro: async (req, res, next) => {

  //   let productPurchased
  //   let prodid = req.params.id;
  //   if(req.session.userloggedIn){
  //   let customerId = req.session.user._id;
  //   const reviews = await reviewColl.find({ 'reviews.product': prodid }).select('reviews.name');
  //   productHelper.hasProductInOrder(customerId, prodid).then(result => {
  //     if (result) {
  //       productPurchased = true;
  //       console.log('User has the product in their order.');
  //     } else {
  //       productPurchased = false;
        
  //       console.log('User does not have the product in their order.');
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // }else{
  //   productPurchased = false;
  // }

  //   productHelper.findProductByIdUser(prodid).then((product) => {
    //  let noStock;
    //  if(product.stock == '0'){
//
    //   noStock = true;
    //  }else{
    //   noStock = false;   
    //     }
  //     console.log("<=-------SINGLE PRODUCT PAGE---------=>", product);
  //     if (req.session.userloggedIn) {
  //       let userId = req.session.user._id;
      
  //       carthelper.checkProduct(userId, product).then((response) => {
  //         console.log("Product On Cart: ", response);
  //         if (response) {
  //           res.render("user/single-product", {
  //             product,
  //             oncart: true,
  //             user: req.session.user,
  //             noStock,
  //             productPurchased,
  //             reviews: reviews.map(review => review.reviews.name)
  //           });

  //         } else {
  //           res.render("user/single-product", {
  //             product,
  //             oncart: false,
  //             user: req.session.user,
  //             noStock,
  //             productPurchased
  //           });
  //         }
  //       });
  //     } else {
  //       res.render("user/single-product", {
  //         product,
  //         oncart: false,
  //         user: req.session.user,
  //         noStock,
  //         productPurchased
  //       });
  //     }
  //   });
  // },

  
  saveProductReview: (req, res) => {
    

    let productId = req.body.productId;
    let revmessage = req.body.revmessage;
    let revname = req.body.revname;
    let userId = req.session.user._id;
  console.log("review messages",productId,revname,userId,revmessage)
 productHelper.saveProductReview(userId, productId, revname, revmessage)
  
  


  },

  getStock: (req, res) => {
    const productId = req.body.productId;
    productHelper
      .getStock(productId)
      .then((stock) => {
        res.status(200).json({ stock: stock });
      })
      .catch((error) => {
        console.log("Error in controller while getting stocks", error);
      });
  },

  searchProduct: (req, res, next) => {
    const customer = (user = req.session.user);
    const keyword = req.body.keyword;

    productHelper
      .searchProduct(keyword)
      .then(({ products }) => {
        res.status(200).json({ products: products });
      })
      .catch((error) => {
        console.log("Search product failed: ", error);
        // Handle the error appropriately
      });
  },
  categorise: (req, res, next) => {
    const customer = (user = req.session.user);
    const category = req.body.category;  

    productHelper.categorise(category)
      .then(({ products }) => {
        res.status(200).json({ products: products });
      })
      .catch((error) => {
        console.log("Search products on category failed: ", error);
        // Handle the error appropriately
      });
  },
  
};
