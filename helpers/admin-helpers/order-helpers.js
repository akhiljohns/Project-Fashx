const { ObjectId } = require('mongodb');

//controllers

//models
const customerCollection = require('../../models/user-model');
const user_address = require('../../models/address-model');

const cart = require('../../models/cart-model');
const products = require('../../models/product-model');
const orderCollection = require('../../models/order-model');


module.exports = {
    getOrdersadmin: () => {
        try {
          return new Promise((resolve, reject) => {
            orderCollection.aggregate([
              { $unwind: "$order" },
              {
                $lookup: {
                  from: "users",
                  localField: "order.user",
                  foreignField: "_id",
                  as: "order.userDetails",
                },
              },
              { $sort: { "order.date": -1 } }, // Sort by descending order of 'order.date'
              { $project: { _id: 0, order: "$order" } },
            ])
              .exec()
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          });
        } catch (err) {
          console.log("Error getting orders", err);
        }
      },
      
    getOrderDetails: (orderId, userId) => {
        try {
            return  new Promise((resolve, reject) => {
                orderCollection.findOne({userId: userId, 'order._id': orderId}, {'order.$': 1})
                    .populate('order.user')
                    .populate('order.items.product').lean()
                    .then((response) => {
                        console.log('response after getiing order details',response);
                        resolve(response);
                    }).catch((err) => {
                        console.log('error on getting order details inside helper',err);
                    })
            })
        } catch(err) {
            console.log('Error in orderHelper while getting orderdetails', err);
        }
    },

    
// for (let i = 0; i < orderProds.length; i++) {
//     let prodstock = orderProds[i].product.stock
// let cartquan = orderProds[i].quantity
// console.log("CART QUANTITY-----=>",i,cartquan)
// console.log("CART PROD STOCK-----=>",i,prodstock)
// let remainstock = prodstock - cartquan
// let prodid = orderProds[i].product._id

// await products.updateOne({_id: prodid}, {$set: {stock: remainstock}});
// }
   
stockUpdate: async (orderId, userId) => {
    try {
      const order = await orderCollection.findOne({ _id: orderId, userId }).populate('order.items.product');
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      const orderItems = order.order[0].items;
  
      for (let i = 0; i < orderItems.length; i++) {
        const productId = orderItems[i].product._id;
        const quantity = orderItems[i].quantity;
  
        await incrementProductStock(productId, quantity);
      }
  
      console.log('Product stock updated successfully');
    } catch (error) {
      console.error('Error while updating product stock:', error);
    }
  },
  
incrementStock: async (productId,quantity)=>{
    try {
        const product = await products.findOne({ _id: productId });
        if (!product) {
          throw new Error('Product not found');
        }else{
    
        const currentStock = product.stock;
        const updatedStock = currentStock + quantity;
    
        await products.updateOne({ _id: productId }, { $set: { stock: updatedStock } });
        console.log('Product stock updated successfully');
        }
      } catch (error) {
        console.error('Error while incrementing product stock:', error);
      }
},                     


// async function incrementProductStock(productId, quantity) {
//     try {
//       const product = await products.findOne({ _id: productId });
//       if (!product) {
//         throw new Error('Product not found');
//       }
  
//       const currentStock = product.stock;
//       const updatedStock = currentStock + quantity;
  
//       await products.updateOne({ _id: productId }, { $set: { stock: updatedStock } });
//       console.log('Product stock updated successfully');
//     } catch (error) {
//       console.error('Error while incrementing product stock:', error);
//     }
//   },
  





   cancelOrder: (orderId, userId) => {
        try{
            return new Promise(async (resolve, reject) => {
                const orders = await orderCollection.findOne({userId: userId}).populate('order.items.product');
                orderCollection.updateOne({ userId: userId, "order._id": orderId },{ $set: { "order.$.status": "Cancelled" } }
                ).then((response)=>{
                    resolve(response);
                })
            })
        } catch(err){
            console.log('Error while canceling an Order:', err);
        }
    },
   deliverOrder: (orderId, userId) => {
        try{
            return new Promise(async (resolve, reject) => {
                const orders = await orderCollection.findOne({userId: userId}).populate('order.items.product');
                orderCollection.updateOne({ userId: userId, "order._id": orderId },{ $set: { "order.$.status": "Delivered" } }
                ).then((response)=>{
                    resolve(response);
                })
            })
        } catch(err){
            console.log('Error while canceling an Order:', err);
        }
    },
   returnOrder:(orderId, userId) => {
    try {
        return new Promise(async (resolve, reject) => {
            const orders = await orderCollection.findOne({ userId: userId, 'order._id': orderId }, { 'order.$': 1 });
            console.log(orders.order[0].totalAmount, "|TOTAL AMOUNT");
            totalAmount = orders.order[0].totalAmount;

            // Fetch the user document to get the current wallet value
            const user = await customerCollection.findOne({ _id: userId });
            let walletValue = 0;
            
            if (user && user.wallet !== undefined) {
                walletValue = user.wallet;
            }

            // Increment the wallet value with the totalAmount if it's not zero
            if (walletValue !== 0) {
                totalAmount += walletValue;
            }

            // Update the user's wallet value
            await customerCollection.updateOne({ _id: userId }, { $set: { wallet: totalAmount } });

            orderCollection.updateOne({ userId: userId, "order._id": orderId }, { $set: { "order.$.status": "Returned" } })
                .then((response) => {
                    resolve(response);
                });
        });
    } catch (err) {
        console.log('Error while canceling an Order:', err);
    }
},
    
   

    

    // //function to fetch no. of items in a cart and whishlist of a customer
    // getCartOrWishlistCount: (userId) => {
    //     return new Promise((resolve, reject) => {
    //         cart.findOne({userId: userId}).lean().then((cartResponse) => {
    //             wishlist.findOne({user: userId}).lean().then((wishlistResponse) => {
    //                 const cartLength = cartResponse? cartResponse.items.length : 0;
    //                 const wishlistLength = wishlistResponse? wishlistResponse.items.length : 0;
    //                 resolve({cartLength: cartLength, wishlistLength: wishlistLength});
    //             }).catch((err)=> {
    //                 console.log('Error getting wishlist length', err);
    //                 resolve({error: true});
    //             })
    //         }).catch((err) => {
    //             console.log('Error getting wishlist length', err);
    //             resolve({error: true});
    //         })
    //     })
    // }


}