const session = require("express-session");
const productHelper = require("../../helpers/product-helpers/product-helper");
const categoryHelper = require('../../helpers/product-helpers/category-helper');

module.exports = {
  // getAddproduct: (req, res, next) => {
  //   res.render("admin/add-product", { admin: true });
  // },
  getAddproduct: (req, res, next) => {
    categoryHelper.allCategory().then((category) => {
      res.render("admin/add-product",{admin:true, category})
    })
},

postAddproduct: async (req, res) => {
  let productDetails = req.body;
  let images = req.files;
 console.log("---------------PRODUCTDETIALS------------",productDetails)

  try {
    await productHelper.addProduct(productDetails, images);
    res.redirect("/admin/productS");
  } catch (err) {
    console.log(err);
  }
},
  // postAddproduct: async (req, res) => {
    
  //   let productDetails = req.body;
  //   let image = req.files;
  //   console.log(image);

  //   try {
  //     await productHelper.addProduct(productDetails, image);
  //     res.redirect("/admin/productS");
  //     console.log("-----------PRODUCT ADDED IN THE DATABASE-----------");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  showProducts: (req, res, next) => {
    productHelper.showProductsAdmin().then((products) => {
      res.render("admin/products", { products, admin: true});
    });
  },
};
