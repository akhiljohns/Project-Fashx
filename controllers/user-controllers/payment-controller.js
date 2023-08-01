const userHelper = require("../../helpers/user-helpers/user-helper");
const paymentHelper = require("../../helpers/user-helpers/payment-helper");

const cart = require("../../models/cart-model");

const paymentController = {


  doPayment: async (req, res, next) => {
    try {
      const address = req.body.address;
      const paymentMethod = req.body.paymentMethod;
      const userId = req.session.user._id;
 
      const stockExst = await paymentHelper.checkStock(userId) 

      console.log(stockExst,"--------===============----------")
      if(stockExst){
        paymentHelper.completeOrder(userId, address, paymentMethod).then((response) => {
          req.session.lastOrder = response.order[response.order.length - 1];
          res.status(200).send({ codSuccess: true });
        });
      }else{

        // CART DELETION 
        await cart.deleteOne({ userId: userId });

        res.status(200).send({ codSuccess: false});

      }
    } catch (err) {
      console.log("Payment Error: ", err);
    }
  },
  

  // doRzpPayment: (req, res, next) => {
  //     try {
  //         const address = req.body.address;
  //         const paymentMethod = 'razorpay'
  //         const userId = req.session.user._id;
  //         const couponCode = req.body.coupon;
  //         const amount = req.body.amount;
  //         const orderNo = req.body.orderNo;
  //         paymentHelper.rzpPayment(userId, address, paymentMethod, couponCode, orderNo, amount).then((response)=> {
  //             console.log(response);
  //             req.session.lastOrder = response.order[response.order.length-1];
  //             res.status(200).json({response, rzpStatus: true});
  //         }).catch((err) => {
  //             console.log('something went wrong', err)
  //             res.status(200).json({rzpStatus: false});
  //         })
  //     } catch (error) {
  //         console.log('Error in payment rzp controller', error);
  //     }
  // }
};

module.exports = paymentController;
