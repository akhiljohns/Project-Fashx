//razorpay
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.RZP_SECRET_KEY;
const keyid = process.env.RZP_KEY_ID;
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: keyid,
    key_secret: secretKey,
  });

//import models
const cart = require("../../models/cart-model");
const products = require("../../models/product-model");
const customer = require("../../models/user-model");
const order = require("../../models/order-model");
const couponCollection = require('../../models/coupon-model');

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

checkStock: async (userId) => {
  const scart = await cart.findOne({ userId: userId }).populate("items.product");
  
      let orderProds = scart.items;

  for (let i = 0; i < orderProds.length; i++) {
    let prodstock = orderProds[i].product.stock;
    let cartquan = orderProds[i].quantity;  
    
   
    if(cartquan > prodstock){
return false;
    }
   
  }
  return true;

},
checkWallet: async (userId,totalAmount) => {
  const user = await customer.findOne({ _id: userId })
  


  if(user.wallet < totalAmount){
    return false;
  }else{
    return true;
  }
   
   

},



  completeOrder: async (userId, address, paymentMethod ,coupon) => {
    try {
      console.log("payment method", paymentMethod);
      console.log("ADDRESS FOR ORDER CONFIRMATION AND PAYMENT----=>", address);
      const scart = await cart.findOne({ userId: userId }).populate("items.product");
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
      if(coupon)

            {
                totalAmount = totalAmount - coupon.discount;
                await customer.updateOne({userId: userId}, {$push: {usedCoupons: coupon._id}});
            }

      if(paymentMethod == 'Wallet'){
        const user = await customer.findOne({ _id: userId });
        let walletValue = 0;

        if (user && user.wallet !== undefined) {
          walletValue = user.wallet;
        }

        // Increment the wallet value with the totalAmount if it's not zero
        if (walletValue !== 0) {
          walletValue -= totalAmount;
        }

        // Update the user's wallet value
        await customer.updateOne(
          { _id: userId },
          { $set: { wallet: walletValue } }
        );

        // req.session.user.wallet = walletValue;

      }

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
                    discount: coupon ? coupon.discount : 0,
                    shippingCharge: shipping,
                  },  
                },
              }
            )
            .then(async (response) => {
              if(coupon){
                await customer.updateOne({userId: userId}, {$push: {usedCoupons: coupon._id}});
            }
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
                  discount: coupon ? coupon.discount : 0,
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

  generateRazorpay: (orderId, total) => {
    return new Promise((resolve, reject) => {
        instance.orders.create({
          amount: total*100,

            currency: "INR",
            receipt: "" + orderId,
            notes: {
              key1: "value3",
              key2: "value2"
            }
          }).then((res) => {
            console.log('razorpay instance:: -=-=-==-', res);
            resolve(res);
          }).catch((err) => {
            console.log('Error creating rzp instance:: ', err);
          })
    })
},

  getTotalAmount: (userId ,coupon) => {
      return new Promise(async(resolve, reject) => {
          const orderNo = genarateOrderNo();
          let usedCoupon
          if(coupon){
           usedCoupon = await couponCollection.findOne({code: coupon.code});
          }
       
           cart.findOne({userId: userId}).then((res) => {
              let finalAmount = (res.totalAmount + shipping) - (usedCoupon? usedCoupon.discount : 0) ;
              const response = {finalAmount: finalAmount, orderNo: orderNo,}
             
              resolve(response);
          }).catch((err) => {
              console.log('Error getting cart total amount:: ', err);
              resolve({error: true});
          })
      })
  },

  rzpPayment: async (userId, address, paymentMethod, orderNo, totalAmount,couponCode) => {

      try {
          const shopcart = await cart.findOne({ userId: userId }).populate('items.product');
          let date = Date.now();
          const coupon = couponCollection.findOne({ code: couponCode });
        let parseAddress =   JSON.parse(address);
         
          const orderCollection = await order.findOne({ userId: userId }); 
       
          

          let orderProds = shopcart.items;

          // LOOP TO UPDATE STOCK COUNT WHILE PLACING ORDR
    
          for (let i = 0; i < orderProds.length; i++) {
            let prodstock = orderProds[i].product.stock;
            let cartquan = orderProds[i].quantity;
      
            let remainstock = prodstock - cartquan;
            let prodid = orderProds[i].product._id;
    
            await products.updateOne(
              { _id: prodid },
              { $set: { stock: remainstock } }
            );
          }
          return new Promise((resolve, reject) => {
              if (orderCollection) {
                  order.updateOne({ userId: userId }, {
                      $push: {
                          order: {
                            user: userId,
                            orderNo: orderNo,
                            items: shopcart.items,
                            totalAmount: totalAmount,
                            userId: userId,
                            date: date,
                            paymentMethod: paymentMethod,
                            address: parseAddress,
                            discount: coupon ? coupon.discount : 0,
                            shippingCharge: shipping,
                          }
                      }
                  }).then(async (response) => {
                    if (coupon) {
                      await customer.updateOne({ userId: userId }, { $push: { usedCoupons: coupon._id } });
                  }
                      order.findOne({ userId: userId }).populate('order.items.product').lean().then(async (order) => {
                          await  cart.deleteOne({ userId: userId });
                          resolve({ status: true, ...order });
                      })
                  }).catch((err) => {
                      console.log('Error in rzp paymant 1', err);
                      resolve({ status: false })
                  })
              } else {
                  order.create({
                      userId: userId, order: [{
                        user: userId,
                        orderNo: orderNo,
                        items: shopcart.items,
                        totalAmount: totalAmount,
                        userId: userId,
                        date: date,
                        paymentMethod: paymentMethod,
                        address: parseAddress,
                        discount: coupon ? coupon.discount : 0,
                        shippingCharge: shipping,
                      }]
                  }).then((response) => {
                      order.findOne({ user: userId }).populate('order.items.product').lean().then(async (order) => {
                          await  cart.deleteOne({ userId: userId });
                          resolve({ status: true, ...order });
                      })
                  }).catch((err) => {
                      console.log('Error in rzp paymant 2', err);
                      resolve({ status: false })
                  })
              }
          })
      } catch (error) {
          console.log('Error in rzpPayment::', error);
      }
  }
};

module.exports = paymentHelper;
