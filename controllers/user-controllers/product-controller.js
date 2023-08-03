const productHelper = require("../../helpers/product-helpers/product-helper");
const categoryHelper = require("../../helpers/product-helpers/category-helper");
const carthelper = require("../../helpers/product-helpers/cart-helper");
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

  getSinPro: (req, res, next) => {
    let prodid = req.params.id;

    productHelper.findProductByIdUser(prodid).then((product) => {
      console.log(product.stock,"----------=========================--------------")
      let noStock;
      if(product.stock == '0'){

       noStock = true;
      }else{
       noStock = false;   
         }
      console.log("<=-------SINGLE PRODUCT PAGE---------=>", product);
      if (req.session.userloggedIn) {
        let userId = req.session.user._id;
        carthelper.checkProduct(userId, product).then((response) => {
          console.log("Product On Cart: ", response);
          if (response) {
            res.render("user/single-product", {
              product,
              oncart: true,
              user: req.session.user,
              noStock,
            });

          } else {
            res.render("user/single-product", {
              product,
              oncart: false,
              user: req.session.user,
              noStock,
            });
          }
        });
      } else {
        res.render("user/single-product", {
          product,
          oncart: false,
          user: req.session.user,
          noStock,
        });
      }
    });
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
