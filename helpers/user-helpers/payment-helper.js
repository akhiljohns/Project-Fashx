//razorpay
// const dotenv = require('dotenv');
// dotenv.config();
// const secretKey = process.env.RZP_SECRET_KEY;
// const Razorpay = require('razorpay');
// var instance = new Razorpay({
//     key_id: 'rzp_test_MTk5iQyefsRP1C',
//     key_secret: secretKey,
//   });

//import models
const cart = require("../../models/cart-model");
const products = require("../../models/product-model");
const customer = require("../../models/user-model");
const order = require("../../models/order-model");
// const couponCollection = require('../../models/coupon-model');

// additional functions
//1-----checking the ordernumber is unique or not
async function checkOrderNumber(orderNo) {
  let orderNumber = await order.find({ orderNo: orderNo });
  if (!orderNumber) {
    return true;
  } else {
    return false;
  }
}

// 2-----function to genarate random five didgit number for orders
function genarateOrderNo() {
  let min = 10000,
    max = 99999;
  let randomNo = Math.floor(Math.random() * (max - min + 1)) + min;
  let OrderNo = "FASHX" + randomNo;
  let available = checkOrderNumber(OrderNo);
  if (available) {
    return OrderNo;
  } else {
    genarateOrderNo();
  }
}

//additional variables
//tax and shipping charges
shipping = 50;

const paymentHelper = {
  /* The `completeOrder` function is a helper function that takes in three parameters: `userId`,
    `address`, and `paymentMethod`. */
  completeOrder: async (userId, address, paymentMethod) => {
    try {
      console.log("payment method", paymentMethod);
      console.log("ADDRESS FOR ORDER CONFIRMATION AND PAYMENT----=>", address);
      const scart = await cart
        .findOne({ userId: userId })
        .populate("items.product");
      let totalAmount = 0,
        date = Date.now();
      console.log("ORDER PLACING ITEM.PRODUCT", scart.items);
      //genarating orderNo.
      const orderNo = genarateOrderNo();

      let orderProds = scart.items;

      // LOOP TO UPDATE STOCK COUNT WHILE PLACING ORDR

      for (let i = 0; i < orderProds.length; i++) {
        let prodstock = orderProds[i].product.stock;
        let cartquan = orderProds[i].quantity;
        console.log("CART QUANTITY-----=>", i, cartquan);
        console.log("CART PROD STOCK-----=>", i, prodstock);
        let remainstock = prodstock - cartquan;
        let prodid = orderProds[i].product._id;

        await products.updateOne(
          { _id: prodid },
          { $set: { stock: remainstock } }
        );
      }

      //loop to calculate the total amount;
      for (let i = 0; i < scart.items.length; i++) {
        totalAmount +=
          scart.items[i].product.regularPrice * scart.items[i].quantity;
      }
      //discount applying and tax towards total amount (pending)
      totalAmount += shipping;

      //getting order collection
      const orderCollection = await order.findOne({ userId: userId });
      //updating or creating order
      return new Promise((resolve, reject) => {
        if (orderCollection) {
          order
            .updateOne(
              { userId: userId },
              {
                $push: {
                  order: {
                    user: userId,
                    orderNo: orderNo,
                    items: scart.items,
                    totalAmount: totalAmount,
                    userId: userId,
                    date: date,
                    paymentMethod: paymentMethod,
                    address: address,
                    shippingCharge: shipping,
                  },  
                },
              }
            )
            .then(async (response) => {
              order
                .findOne({ userId: userId })
                .populate("order.items.product")
                .lean()
                .then(async (res) => {
                  await cart.deleteOne({ userId: userId });
                  resolve(res);
                });
            });
        } else {
          order
            .create({
              userId: userId,
              order: [
                {
                  user: userId,
                  orderNo: orderNo,
                  items: scart.items,
                  totalAmount: totalAmount,
                  userId: userId,
                  date: date,
                  paymentMethod: paymentMethod,
                  address: address,
                  shippingCharge: shipping,
                },
              ],
            })
            .then((response) => {
              order
                .findOne({ userId: userId })
                .populate("order.items.product")
                .lean()
                .then(async (res) => {
                  await cart.deleteOne({ userId: userId });
                  resolve(res);
                });
            });
        }
      });
    } catch (err) {
      console.log("Error in Helper while processing with order", err);
    }
  },

  /* `generateRazorpay` is a function that takes in two parameters: `orderId` and `total`. It creates
    a new Promise and returns it. Inside the Promise, it uses the `instance` of the Razorpay API to
    create a new order with the specified `amount`, `currency`, `receipt`, and `notes`. Once the
    order is created, it logs the response to the console and resolves the Promise with the
    response. This function is used to generate a new Razorpay order for a given `orderId` and
    `total` amount. */
  // generateRazorpay: (orderId, total) => {
  //     return new Promise((resolve, reject) => {
  //         instance.orders.create({
  //             amount: total*100,
  //             currency: "INR",
  //             receipt: "Order" + orderId,
  //             notes: {
  //               key1: "value3",
  //               key2: "value2"
  //             }
  //           }).then((res) => {
  //             console.log('razorpay instance:: ', res);
  //             resolve(res);
  //           }).catch((err) => {
  //             console.log('Error creating rzp instance:: ', err);
  //           })
  //     })
  // },

  // getTotalAmount: (userId, coupon) => {
  //     return new Promise(async(resolve, reject) => {
  //         const orderNo = genarateOrderNo();
  //         const usedCoupon = await couponCollection.findOne({code: coupon});
  //          cart.findOne({userId: userId}).then((res) => {
  //             let finalAmount = (res.totalAmount + shipping + tax)- (usedCoupon? usedCoupon.discount : 0);
  //             const response = {finalAmount: finalAmount, orderNo: orderNo,}
  //             resolve(response);
  //         }).catch((err) => {
  //             console.log('Error getting cart total amount:: ', err);
  //             resolve({error: true});
  //         })
  //     })
  // },

  // rzpPayment: async (userId, address, paymentMethod, couponCode, orderNo, amount) => {
  //     console.log(orderNo);
  //     try {
  //         const cart = await  cart.findOne({ userId: userId }).populate('items.product');
  //         let date = Date.now();
  //         const coupon = couponCollection.findOne({ code: couponCode });
  //         const orderCollection = await order.findOne({ userId: userId }); 
  //         //updating or creating order
  //         return new Promise((resolve, reject) => {
  //             if (orderCollection) {
  //                 order.updateOne({ userId: userId }, {
  //                     $push: {
  //                         order: {
  //                             user: userId,
  //                             orderNo: orderNo,
  //                             items: cart.items,
  //                             totalAmount: amount,
  //                             userId: userId, date: date,
  //                             paymentMethod: paymentMethod,
  //                             address: address,
  //                             discount: coupon ? coupon.discount : 0,
  //                             shippingCharge: shipping,
  //                             taxAmount: tax
  //                         }
  //                     }
  //                 }).then(async (response) => {
  //                     if (coupon) {
  //                         await customer.updateOne({ userId: userId }, { $push: { usedCoupons: coupon._id } });
  //                     }
  //                     order.findOne({ userId: userId }).populate('order.items.product').lean().then(async (order) => {
  //                         await  cart.deleteOne({ userId: userId });
  //                         resolve({ status: true, ...order });
  //                     })
  //                 }).catch((err) => {
  //                     console.log('Error in rzp paymant 1', err);
  //                     resolve({ status: false })
  //                 })
  //             } else {
  //                 order.create({
  //                     userId: userId, order: [{
  //                         user: userId,
  //                         orderNo: orderNo,
  //                         items: cart.items,
  //                         totalAmount: amount,
  //                         userId: userId, date: date,
  //                         paymentMethod: paymentMethod,
  //                         address: address,
  //                         discount: coupon ? coupon.discount : 0,
  //                         shippingCharge: shipping,
  //                         taxAmount: tax
  //                     }]
  //                 }).then((response) => {
  //                     order.findOne({ user: userId }).populate('order.items.product').lean().then(async (order) => {
  //                         await  cart.deleteOne({ userId: userId });
  //                         resolve({ status: true, ...order });
  //                     })
  //                 }).catch((err) => {
  //                     console.log('Error in rzp paymant 2', err);
  //                     resolve({ status: false })
  //                 })
  //             }
  //         })
  //     } catch (error) {
  //         console.log('Error in rzpPayment::', error);
  //     }
  // }
};

module.exports = paymentHelper;
