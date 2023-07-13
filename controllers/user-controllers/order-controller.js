const { response } = require('express');
const userHelper = require('../../helpers/user-helpers/user-helper');
const cart = require('../../models/cart-model')

//importing helpers
const orderHelper = require('../../helpers/user-helpers/order-helper');




const orderManagement = {

    showAddress: (req, res, next) => {

        const userId = req.session.user._id;
      
      
        userHelper.getAddress(userId).then((user_address) => {
            cart.findOne({userId: req.session.user._id}).then((response) => {
               
                       
                        const address = user_address? user_address.address: null;
                        res.render('user/checkout', {address: address, totalAmount: response.totalAmount, user: req.session.user });
               
            }).catch((error) => {
                res.redirect('/cart');
            })
        })
    },

// getOrders:(req, res)=> {
// res.render('user/orders',{user:req.session.user})
// },

    

    getOrders: (req, res) => {
        const customer = user = req.session.user;
        const userId = req.session.user._id;
        userHelper.getOrders(userId).then((response) => {
            if(response){
                const orders = response.order
                for(let i = 0; i < orders.length; i++) {
                    orders[i].no = orders[i].items.length;
                }
                res.render('user/orders', {orders, customer, user })
            } else {
                res.render('user/orders', {noOrders: true, customer, user})
            }
        })
    },


   
    getOrderdetails: (req, res, next) => {
        const orderId = req.query.orderId;
        const userId = req.session.user._id;
        userHelper.getOrderdetails(orderId, userId).then((order) => {
            if(order){
                res.render('user/order-details', {order, customer: req.session.user,user:req.session.user})
            }
        })
    },


    // /* `cancelOrder` is a method that handles a request to cancel an order. It first gets the order ID
    // and user ID from the request query and session respectively. It then uses the `cancelOrder`
    // method from the `orderHelper` module to cancel the order. If the order is successfully
    // cancelled, it sends a JSON response with a status code of 200 and the response data. If there is
    // an error, it logs the error and sends a JSON response with a status code of 400 and an error
    // message. */
    // cancelOrder: (req, res, next) => {
    //     try{
    //         const orderId = req.query.orderId;
    //         const userId = req.session.user._id;
    //         orderHelper.cancelOrder(orderId, userId).then((response) => {
    //             res.status(200).json(response)
    //         }).catch((error) => {
    //             res.status(400).json({message: 'Somethings wrong cancelling order'})
    //         })
    //     } catch (error) {
    //         console.log('error in controller while canceling the order', error);
    //     }
    // },




    // /* `returnOrder` is a method that handles a POST request to return an order. It first gets the
    // order ID and user ID from the request query and session respectively. It then uses the
    // `returnOrder` method from the `orderHelper` module to return the order. If the order is
    // successfully returned, it sends a JSON response with a status code of 200 and the response data.
    // If there is an error, it logs the error and redirects to the `/order` page. */
    // returnOrder: (req, res, next) => {
    //     const orderId = req.query.orderId;
    //     const userId = req.session.user._id;

    //     orderHelper.returnOrder(orderId, userId).then((response) => {
    //         res.status(200).json(response);
    //     }).catch((err) => {
    //         console.log('Error in returnOrder Controller:', err);
    //         res.redirect('/order');
    //     })
    // }






}



module.exports = orderManagement;