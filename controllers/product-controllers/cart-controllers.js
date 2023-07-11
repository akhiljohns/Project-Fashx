const { response } = require("express");
const cartHelper = require("../../helpers/product-helpers/cart-helper");
const productHelper = require("../../helpers/product-helpers/product-helper");

const cartController = {
  addtoCart: (req, res, next) => {

    if(!req.session.user){
      res.status(200).json({user:false});
    }
    // let data = JSON.parse(req.query.data);
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const customer = req.session.user;

    if (customer) {
      console.log(customer);
      cartHelper.addtoCart(customer, productId,quantity).then((cart) => {
        req.session.user.cart = cart;

        productHelper.findProductByIdUser(productId).then((product) => {
          // res.render("user/single-product", {
          //   product,
          //   resmsg: true,
          //   user: req.session.user,
          // });

          res.status(200).json({resmsg: true})
        });
      });
    } else {
      console.log("no user");
      
    }
  },

  showCart: (req, res) => {
    try {
      const customer = req.session.user;
      cartHelper.showCart(customer).then(async (cart) => {
        // let products = cart.items
        let products = cart.items, total = [], subtotal = 0;
        if (products && products.length > 0) {
                    console.log("cart items__________________________________",cart.items);

                    for (let i=0; i<products.length; i++) {
                        products[i].amount = products[i].product.regularPrice * products[i].quantity;
                    }//to find total product price.
                    for (let i = 0; i < products.length; i++) {
                        subtotal += products[i].amount;
                    }

          
          console.log("<=---PRODUCT----=>",products )
          res.render("user/cart", { products, user: req.session.user , subtotal ,emptyCart:false});
        } else {
          res.render("user/cart", { products, user: req.session.user ,emptyCart:true });
        }
      });
    }
     catch (err) {
      console.log("Error while showing cart: " + err);
    }
  },

  removeItem: (req, res) => {
      const userId = req.session.user._id
      const itemId = req.query.itemId;
      cartHelper.removeItem(userId, itemId).then((response) => {
          console.log(response)
          // res.redirect('/cart')
          res.status(200).json({response: response});
      })  
  },


  addQuantity: (req, res, next) => {
  const itemId = req.query.itemId;
  const userId = req.session.user._id;
  const productId = req.body.productId;
  cartHelper.addQuantity(itemId, userId, productId).then((cart) => {
      console.log('<=-----ADD QUANTITY RESULT-----=>',cart);
      res.status(200).json({cart});
  }).catch((err) => {
      console.log('the error occurred: '+ err);
  })
},


reduceQuantity: (req, res, next) => {
  const itemId = req.query.itemId;
  const userId = req.session.user._id;
  const productId = req.body.productId;
  cartHelper.reduceQuantity(itemId, userId, productId).then((cart) => {
    console.log('<=-----REDUCE QUANTITY RESULT-----=>',cart);

      res.status(200).json({cart: cart});
  }).catch((err) => {
      console.log('the error occurred: '+ err);
  })
},


  // // This is a function which helps to add the quantity of a product in the cart by calling another function addQuantity in cartHelper.
  //     addQuantity: (req, res, next) => {
  //         const itemId = req.query.itemId;
  //         const userId = req.session.user._id;
  //         const productId = req.body.productId;
  //         cartHelper.addQuantity(itemId, userId, productId).then((cart) => {
  //             console.log('hii',cart);
  //             res.status(200).json({cart});
  //         }).catch((err) => {
  //             console.log('the error occurred: '+ err);
  //         })
  //     },

  // // This is a function which helps to reduce the quantity of a product in the cart by calling another function reduceQuantity in cartHelper.
  //     reduceQuantity: (req, res, next) => {
  //         const itemId = req.query.itemId;
  //         const userId = req.session.user._id;
  //         const productId = req.body.productId;
  //         cartHelper.reduceQuantity(itemId, userId, productId).then((cart) => {
  //             console.log(cart);
  //             res.status(200).json({cart: cart});
  //         }).catch((err) => {
  //             console.log('the error occurred: '+ err);
  //         })
  //     },

  //     /* `removeItem` is a function in the `cartController` object that is used to remove an item from
  //     the user's cart. It takes in the `req`, `res`, and `next` parameters. It first gets the `userId`
  //     from the `req.session.user._id` and the `itemId` from the `req.params.id`. It then calls the
  //     `removeItem` function from the `cartHelper` module, passing in the `userId` and `itemId`. Once
  //     the item is removed from the cart, it redirects the user to the cart page using
  //     `res.redirect('/cart')`. */
  //     removeItem: (req, res, next) => {
  //         const userId = req.session.user._id
  //         const itemId = req.params.id;
  //         cartHelper.removeItem(userId, itemId).then((response) => {
  //             console.log(response)
  //             res.redirect('/cart')

  //         })
  //     },

  //     /* `checkProduct` is a function in the `cartController` object that is used to check if a product
  //     is already in the user's cart. It takes in the `req`, `res`, and `next` parameters. It first
  //     gets the `userId` from the `req.session.user._id`. If there is no user session, it sends a
  //     response with `productInCart` set to `false`. It then gets the `productDetails` from the
  //     `req.body`. It calls the `checkProduct` function from the `cartHelper` module, passing in the
  //     `userId` and `productDetails`. Once the product is checked, it sends a response with
  //     `productInCart` set to `true` if the product is already in the cart, or logs a message to the
  //     console if the product is not in the cart. */
  //     checkProduct: (req, res, next) => {
  //         let userId ;

  //         if(req.session.user) {
  //             userId = req.session.user._id;
  //         } else {
  //             res.status(200).json({productInCart:false});
  //         }

  //         const productDetails = req.body;

  //         cartHelper.checkProduct(userId, productDetails).then((response) => {
  //             console.log(response);
  //             if(response) {
  //                 res.status(200).json({productInCart:response})
  //             } else {
  //                 console.log('product is available to add to cart');
  //                 res.status(200).json({productInCart:response})
  //             }
  //         })
  //     }

  // }
};

module.exports = cartController;
