//importing helpers
const salesHelper = require('../../helpers/admin-helpers/sales-helper');

module.exports = {
    getDashboard: (req, res, next) => {
        salesHelper.showSales().then((todaySales)=> {
            res.render('admin/dashboard', {todaySales, admin: req.session.admin});
        }).catch((err)=> {
            console.log('Error in getting dashords', err);
        })
    },


    getSales: (req, res, next) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales)=> {
            res.status(200).json({sales});
        }).catch((err)=> {
            console.log('error getting sales in controller', err);
            res.status(200).json({error: true});
        })
    },

    getPaymentMethod: (req, res, next) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales)=>{
            let Razorpay = 0, COD = 0, Wallet = 0, others = 0;
            for(let i=0; i<sales.length; i++){
                if(sales[i].order.paymentMethod == 'Razorpay'){
                    Razorpay ++;
                } else if(sales[i].order.paymentMethod == 'COD'){
                    COD ++;
                } else if(sales[i].order.paymentMethod == 'Wallet') {
                    Wallet ++;
                }else{
                    others++;
                }
            }
            console.log(Razorpay, COD, Wallet,others,"-=-==-paymnet")
            res.status(200).json({Razorpay, COD, Wallet,others});
        })
    },


    salesForGraph: (req, res) => {
        const time = req.body.time;
        salesHelper.getSales(time).then((sales) => {
            const totalSales = sales.length;
            let salesDate = [], revenue =[];
            for(let i=0; i<totalSales; i++) {
                salesDate.push(sales[i].order.date);
                revenue.push(sales[i].order.totalAmount);
            }

            res.status(200).json({salesDate: salesDate, revenue: revenue, totalSales: totalSales});
        })
    }





}