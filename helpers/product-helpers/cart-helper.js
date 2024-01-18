
const cart = require('../../models/cart-model');
const product = require('../../models/product-model');
const customer = require('../../models/user-model');





const cartHelper = {

// This is a database helper fucntion which contains three parameters user, productId and quantity to create a new cart or,
// add an item to the cart. this function contais a promise function which updates or create a cart collection then retures
// a response. the response contains the cart collection.
    addtoCart: (user, productId,quantity)=>{
        try{
            return new Promise(async (resolve, reject) => {
                const userId = user._id;
              let totalAmount = 0
                const activeCart = await cart.findOne({userId: userId}).populate('items.product');
                if(activeCart){
                    let prdct = await product.findOne({_id: productId});
                    let productTotal = prdct.regularPrice * quantity;
                  cart.updateOne({userId: userId},{$push:{items:{product: productId,quantity:quantity, productTotal: productTotal}}}).then((response)=> {
                    cart.findOne({userId: userId}).populate('items.product').then((response)=> {
                        for(let i = 0; i < response.items.length; i++){
                            totalAmount += (response.items[i].product.regularPrice * response.items[i].quantity);
                        }
                        cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((cart)=>{
                           console.log(cart)
                            resolve(cart);
                        })
                            
                    })
                    });
                } else {
                    const prdct = await product.findOne({_id: productId});
                    const productTotal = prdct.regularPrice * quantity;
                    cart.create({userId: userId, items:[{product: productId, quantity: quantity, productTotal: productTotal}]}).then((response)=> {
                        cart.findOne({userId: userId}).populate('items.product').then((response)=> {
                            for(let i = 0; i < response.items.length; i++){
                                totalAmount += (response.items[i].product.regularPrice * response.items[i].quantity);
                            }
                            cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((cart)=>{
                                console.log(cart)
                                resolve(cart);
                            })
                        })
                    });
                }
            })
        } catch(err) {
            console.log('Error while adding to cart: '+ err);
        }
    },

    showCart: (user) => {
        try{
            return new Promise((resolve, reject) => {
                const userId = user._id;
                cart.findOne({userId: userId}).populate('items.product').lean().exec().then((response)=> {
                   console.log(response)
                    resolve(response);
                })
            })
        } catch (err) {
            console.log('Error while fetching cart datas: '+ err);
        }
    }, 


// To Check Product is already In Cart or not
checkProduct: (userId, productDetails) => {
    try {
        console.log("PROD DETAILS",productDetails);
      return new Promise((resolve, reject) => {
        let flag = false;
        cart.findOne({ userId: userId, 'items.product': productDetails._id })
  .then((userCart) => {
            console.log(userCart)
            // const products = userCart?.items;
            // console.log("products", products);
  
            // if (products) {
            //   for (let i = 0; i < products.length; i++) {
            //     if (products[i].product == productDetails._id) {
            //         console.log("product", products[i]);
            //       flag = true;
            //       break;
            //     }
            //   }resolve(flag);
            // }
            console.log("user cart-----",userCart);
            if(userCart){
                resolve(true)
            }else{
                resolve(false)
            }
            
          })
          .catch((err) => {
            console.log('Error in checking product:', err);
            reject(err);
          });
      });
    } catch (err) {
      console.log('Error checking the product availability in cart:', err);
      throw err;
    }
  },


  removeItem: (userId, itemId) => {
    return new Promise((resolve, reject) => {
        cart.findOneAndUpdate({userId: userId}, {$pull: {items: {product: itemId}}}).then((res)=> {
            console.log('from helper: ' + res);
                cart.findOne({userId: userId}).populate('items.product').then(async (response)=> {
                    let totalAmount = 0;
                    for(let i=0; i<response.items.length; i++) {
                        totalAmount += response.items[i].quantity * response.items[i].product.regularPrice
                    }

                    await cart.updateOne({userId: userId}, {$set: {totalAmount: totalAmount}});

                    cart.findOne({userId: userId}).lean().then((shoppingCart)=>{
                   console.log(shoppingCart)

                        resolve(shoppingCart);
                    })
                })
            })

            })
        },

        addQuantity: (itemId, userId, productId) => {
            try{
                return new Promise(async (resolve, reject) => {
                    let totalAmount =0;
                    const prdct = await product.findOne({_id: productId});
                    cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': 1, 'items.$.productTotal': prdct.regularPrice}}).populate('items.product').then((response)=>{
                        cart.findOne({userId: userId}).populate('items.product').then((result) => {
                            for(let i = 0; i < result.items.length; i++){
                                totalAmount += (result.items[i].product.regularPrice * result.items[i].quantity);
                            }
                            cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
                                cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
                                    resolve(productCart);
                                })
                            })
                        })
                        // resolve(response);
                    }).catch((error)=>{
                        console.log('the error is : ' + error.message);
                    })
                })
            } catch(err) {
                console.log('Error while adding quantity in cart: '+ err);
            }
            
        },



       reduceQuantity: (itemId, userId, productId) => {
            try{
                return new Promise(async (resolve, reject) => {
                    let totalAmount=0;
                    const prdct = await product.findOne({_id: productId});
                    cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': -1, 'items.$.productTotal': -prdct.regularPrice}}).populate('items.product').then((response)=>{
                        cart.findOne({userId: userId}).populate('items.product').then((result) => {
                            for(let i = 0; i < result.items.length; i++){
                                totalAmount += (result.items[i].product.regularPrice * result.items[i].quantity);
                            }
                            cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
                                cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
                                    resolve(productCart);
                                })
                            })
                        })
                    
                    }).catch((error)=>{
                        console.log('ther error is : ' + error.message);
                    })
                })
            } catch(err) {
                console.log('Error while reducing quantity in cart: '+ err);
            }
        },
  
// //this is a function which ADDs the quantity of a product in a document from cart collection using userId and productId.
//     addQuantity: (itemId, userId, productId) => {
//         try{
//             return new Promise(async (resolve, reject) => {
//                 let totalAmount =0;
//                 const prdct = await product.findOne({_id: productId});
//                 cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': 1, 'items.$.productTotal': prdct.productPrice}}).populate('items.product').then((response)=>{
//                     cart.findOne({userId: userId}).populate('items.product').then((result) => {
//                         for(let i = 0; i < result.items.length; i++){
//                             totalAmount += (result.items[i].product.productPrice * result.items[i].quantity);
//                         }
//                         cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
//                             cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
//                                 resolve(productCart);
//                             })
//                         })
//                     })
//                     // resolve(response);
//                 }).catch((error)=>{
//                     console.log('the error is : ' + error.message);
//                 })
//             })
//         } catch(err) {
//             console.log('Error while adding quantity in cart: '+ err);
//         }
        
//     },

// //this is a function which REDUCE the quantity of a product in a document from cart collection using userId and productId.
//     reduceQuantity: (itemId, userId, productId) => {
//         try{
//             return new Promise(async (resolve, reject) => {
//                 let totalAmount=0;
//                 const prdct = await product.findOne({_id: productId});
//                 cart.findOneAndUpdate({userId: userId, 'items._id': itemId}, {$inc:{'items.$.quantity': -1, 'items.$.productTotal': -prdct.productPrice}}).populate('items.product').then((response)=>{
//                     cart.findOne({userId: userId}).populate('items.product').then((result) => {
//                         for(let i = 0; i < result.items.length; i++){
//                             totalAmount += (result.items[i].product.productPrice * result.items[i].quantity);
//                         }
//                         cart.updateOne({userId: userId},{$set: {totalAmount: totalAmount}}).populate('items.product').then((userCart)=>{
//                             cart.findOne({userId: userId}).populate('items.product').then((productCart)=>{
//                                 resolve(productCart);
//                             })
//                         })
//                     })
//                     // resolve(response);
//                 }).catch((error)=>{
//                     console.log('ther error is : ' + error.message);
//                 })
//             })
//         } catch(err) {
//             console.log('Error while reducing quantity in cart: '+ err);
//         }
//     },

  

}



module.exports = cartHelper;