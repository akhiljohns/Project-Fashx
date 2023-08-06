const { response } = require("express");
const userHelper = require("../../helpers/user-helpers/user-helper");
const cart = require("../../models/cart-model");
const customerColl = require("../../models/user-model");

const couponManagement = require('../user-controllers/user-coupon-controller');


//importing helpers
const orderHelper = require("../../helpers/user-helpers/order-helper");

const orderManagement = {

  showAddress: async (req, res, next) => {
    const userId = req.session.user._id;
    const cartUser = await customerColl.findOne({ _id: userId });
    let coupons = await couponManagement.getActiveCoupons();
    const couponActive = req.session.couponActive || false;

console.log(cartUser,'cart user -==-=-=-=-=-=-=-')
    userHelper.getAddress(userId).then((user_address) => {
      cart
        .findOne({ userId: req.session.user._id })
        .then((response) => {
          const address = user_address ? user_address.address : null;
          if(response.totalAmount <= 0){
            res.redirect('/cart') 
          }
          else{

          res.render("user/checkout", {
            address: address,
            totalAmount: response.totalAmount,
            wallet:cartUser.wallet,
            user: req.session.user,
            coupons,
            couponActive
          });
        }
        })
        .catch((error) => {
          res.redirect("/cart");
        });
    });
  },

  // getOrders:(req, res)=> {
  // res.render('user/orders',{user:req.session.user})
  // },

  getOrders: (req, res) => {
    const customer = req.session.user;
    const userId = req.session.user._id;

    orderHelper
      .getOrder(userId)
      .then((response) => {
        if (response) {
          const orders = response.order.reverse(); // Reverse the order array to display newest orders first
          for (let i = 0; i < orders.length; i++) {
            orders[i].no = orders[i].items.length;
          }
          res.render("user/orders", { orders, customer ,user: req.session.user,  });
        } else {
          res.render("user/orders", { noOrders: true, customer,user: req.session.user, });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({});
      });
  },


  getOrderdetails:  (req, res, next) => {
    const orderId = req.query.orderId;
    const userId = req.session.user._id;
    orderHelper.getOrderdetails(orderId, userId).then(async (order) => {
        let returnPossible = await orderHelper.getDeliDate(orderId, userId); 
      if (order) {
        res.render("user/order-details", {
          order,
          customer: req.session.user,
          user: req.session.user,
          returnPossible 
        });
      }
    });
  },


  postCancelOrder: (req, res, next) => {
    try {
      const orderId = req.query.itemId;
      const userId = req.session.user._id;
      orderHelper.stockUpdate(orderId, userId);
      orderHelper.cancelOrder(orderId, userId).then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          res
            .status(400)
            .json({ message: "Somethings wrong cancelling order" });
        });
    } catch (error) {
      console.log("error in controller while canceling the order", error);
    }
  },

  
  postReturnOrder: (req, res, next) => {
    try {
      const orderId = req.query.itemId;
      const userId = req.session.user._id;
      console.log("---===---==-==-=[][][]Order Returned:", orderId, userId);
      orderHelper.stockUpdate(orderId, userId);

      orderHelper
        .returnOrder(orderId, userId)
        .then((response) => {
          res.status(200).json(response);
          
        })
        .catch((error) => {
          res.status(400).json({ message: "Somethings wrong Returning order" });
        });
    } catch (error) {
      console.log("error in controller while Returning the order", error);
    }
  },

  getConfirm: (req, res, next) => {
    res.render("user/confirmation", {
      
      order: req.session.lastOrder,
      customer: req.session.user,
      user: req.session.user,
    });
  },
};

module.exports = orderManagement;
