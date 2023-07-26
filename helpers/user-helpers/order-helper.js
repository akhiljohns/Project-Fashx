const { ObjectId } = require("mongodb");

//controllers

//models
const customerCollection = require("../../models/user-model");
const user_address = require("../../models/address-model");

const cart = require("../../models/cart-model");
const products = require("../../models/product-model");
const orderCollection = require("../../models/order-model");

const orderhelper = {
  //order section
  getOrder: (userId) => {
    return new Promise((resolve, reject) => {
      orderCollection
        .findOne({ userId: userId })
        .sort({ "order.date": -1 }) // Sort by descending order of 'order.date'
        .populate("order.items.product")
        .lean()
        .exec()
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getOrderdetails: (orderId, userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        // Get the user's order
        const orderColl = await orderCollection
          .findOne({ userId: userId, "order._id": orderId }, { "order.$": 1 })
          .populate("order.items.product")
          .lean();

        console.log("its order collection", orderColl);
        const order = orderColl.order[0];

        console.log(order);

        if (!order) {
          throw new Error("Order not found");
        }

        // console.log('hello::', products);

        resolve(order);
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


  stockUpdate: async (orderId, userId) => {
    try {
      const order = await orderCollection.findOne(
        { userId: userId, "order._id": orderId },
        { "order.$": 1 }
      );
      const cancelledOrder = order.order[0]; // inside cancelledOrder -> items -> [{product-productid/quantity-quantity to add/totalAmount}]
     

      if (!order) {
        throw new Error("Order not found");
      }

      const orderItems = cancelledOrder.items;
      for (let i = 0; i < orderItems.length; i++) {
        const productId = orderItems[i].product._id;
        const quantity = orderItems[i].quantity;

        await orderhelper.incrementStock(productId, quantity);
      }

      
    } catch (error) {
      console.error("Error while updating product stock:", error);
    }
  },

  incrementStock: async (productId, quantity) => {
    try {
      const product = await products.findOne({ _id: productId });
      if (!product) {
        throw new Error("Product not found");
      } else {
        const currentStock = product.stock;
        const updatedStock = currentStock + quantity;

        await products.updateOne(
          { _id: productId },
          { $set: { stock: updatedStock } }
        );
      }
    } catch (error) {
      console.error("Error while incrementing product stock:", error);
    }
  },

  cancelOrder: (orderId, userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        const orders = await orderCollection
          .findOne({ userId: userId })
          .populate("order.items.product");
        orderCollection
          .updateOne(
            { userId: userId, "order._id": orderId },
            { $set: { "order.$.status": "Cancelled" } }
          )
          .then((response) => {
            resolve(response);
          });
      });
    } catch (err) {
      console.log("Error while canceling an Order:", err);
    }
  },

  returnOrder: (orderId, userId) => {
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


};



module.exports = orderhelper;
