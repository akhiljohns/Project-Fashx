const userHelper = require("../../helpers/user-helpers/user-helper");
const paymentHelper = require("../../helpers/user-helpers/payment-helper");

const cart = require("../../models/cart-model");

const paymentController = {
  doPayment: async (req, res, next) => {
    try {
      const address = req.body.address;
      const paymentMethod = req.body.paymentMethod;
      const userId = req.session.user._id;
      const totalAmount = req.body.totalAmount;
      const stockExst = await paymentHelper.checkStock(userId);

      
      if (stockExst) 
      {
        const walletPossible = await paymentHelper.checkWallet(userId,totalAmount);

            if(paymentMethod == "Razorpay")
            {
            paymentHelper.getTotalAmount(userId).then((response) => {
                if(!response.error){
                    paymentHelper.generateRazorpay(response.orderNo, response.finalAmount).then((resp) => {
                      res.status(200).json({...resp, address, finalAmount:response.finalAmount});
                    }).catch((err) => {
                        console.log('Error in controller while generatingazorpay', err);
                    })
                }
            })
            }
            else if (walletPossible || paymentMethod == 'COD') 
            {

             
              paymentHelper
                .completeOrder(userId, address, paymentMethod)
                .then((response) => {
                  req.session.lastOrder = response.order[response.order.length - 1];
                  res.status(200).send({ codSuccess: true });
                });
            } 
            else if(walletPossible == false )
            {
             

              res.status(200).send({ walletPossible: false });
            }
      } 
      else 
      {
       
        await cart.deleteOne({ userId: userId });

        res.status(200).send({ noStock: true });
      }
    } catch (err) {
      console.log("Payment Error: ", err);
    }
  },


  doRzpPayment: (req, res, next) => {
      try {
          let address = req.body.address;
        
          const paymentMethod = 'Razorpay'
          const userId = req.session.user._id;
          const amount = req.body.amount;
          const orderNo = req.body.orderNo;
          paymentHelper.rzpPayment(userId, address, paymentMethod, orderNo, amount).then((response)=> {
         

              req.session.lastOrder = response.order[response.order.length-1];
              res.status(200).json({response, rzpStatus: true});
          }).catch((err) => {
              console.log('something went wrong', err)
              res.status(200).json({rzpStatus: false});
          })
      } catch (error) {
          console.log('Error in payment rzp controller', error);
      }
  }
};

module.exports = paymentController;
