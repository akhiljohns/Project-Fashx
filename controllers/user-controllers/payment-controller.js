const userHelper = require("../../helpers/user-helpers/user-helper");
const paymentHelper = require("../../helpers/user-helpers/payment-helper");

const paymentController = {


  doPayment: (req, res, next) => {
    try {
      const address = req.body.address;
      const paymentMethod = req.body.paymentMethod;
      const userId = req.session.user._id;

      paymentHelper
        .completeOrder(userId, address, paymentMethod)
        .then((response) => {
          req.session.lastOrder = response.order[response.order.length - 1];
          res.status(200).send({ codSuccess: "true" });
        });
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
