const { ObjectId } = require('mongodb');

//controllers

//models
const customerCollection = require('../../models/user-model');
const user_address = require('../../models/address-model');

const cart = require('../../models/cart-model');
const orderCollection = require('../../models/order-model');


module.exports = {


    //order section
    getOrders: (userId) => {
        return new Promise((resolve, reject) => {
            orderCollection.findOne({userId: userId})
            .sort({ 'order.date': 1 })
            .populate('order.items.product')
            .lean().exec().then((response) => {
                // console.log('orderpage:::', response.order[0].products[0].product);
                resolve(response);
            })
        })
    },
    getOrderdetails:  (orderId, userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                // Get the user's order
                const orderColl = await orderCollection.findOne(
                                    {userId: userId, 'order._id': orderId},
                                    {'order.$': 1}
                                    ).populate('order.items.product').lean();
                                    

                console.log('its order collection',orderColl);
                const order = orderColl.order[0];
                
                console.log(order);

                if (!order) {
                  throw new Error('Order not found');
                }

                // console.log('hello::', products);

                resolve (order);
            })
        } catch (error) {
          console.error(error);
          throw error;
        }
    },
    cancelOrder: (orderId, userId) => {
        try{
            return new Promise((resolve, reject) => {
                orderCollection.updateOne({ userId: userId, "order._id": orderId },{ $set: { "order.$.status": "cancelled" } }
                ).then((response)=>{
                    resolve(response);
                })
            })
        } catch(err){
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