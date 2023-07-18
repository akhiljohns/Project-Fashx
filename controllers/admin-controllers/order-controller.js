const session = require("express-session");

// models
const cartColl = require("../../models/cart-model");
const orderColl = require("../../models/order-model");
const userColl = require("../../models/user-model");
const productColl = require("../../models/product-model");

// HELPERS
const orderHelper = require("../../helpers/admin-helpers/order-helpers");

module.exports = {
  getOrders: (req, res) => {
    try {
      orderHelper.getOrdersadmin().then((orders) => {
        console.log("orders are :::", orders);
        if (orders) {
          for (let i = 0; i < orders.length; i++) {
            let today = orders[i].order.date;
            let year = today.getFullYear();
            let month = String(today.getMonth() + 1).padStart(2, "0");
            let day = String(today.getDate()).padStart(2, "0");
            orders[i].order.date = `${day}-${month}-${year}`;
          }
          res.render("admin/orders", { orders, admin: true });
        } else {
          res.render("admin/orders", { orders, admin: true });
        }
      });
    } catch (err) {
      console.log("Error getting showing orders", err);
    }
  },

  
  getOrderdetails: (req, res, next) => {
    try {
      let orderId = req.query.orderId;
      let userId = req.query.userId;

      orderHelper.getOrderDetails(orderId, userId).then((response) => {
        res.render("admin/order-details", {
          order: response.order[0],
          admin: true,
        });
      });

      console.log("orderId and userId", orderId, userId);
    } catch (err) {
      console.log("error in controller while getting order details", err);
    }
  },
};