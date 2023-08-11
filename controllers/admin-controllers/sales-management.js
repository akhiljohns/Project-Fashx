//importing helpers
const salesHelper = require('../../helpers/admin-helpers/sales-helper');
const orderHelper = require("../../helpers/admin-helpers/order-helpers");
const userCollection = require("../../models/user-model")
const prodColl = require("../../models/product-model")
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
    },

    getSalesReport: (req, res) => {
        try {
          orderHelper.getOrdersadmin().then((orders) => {
          
            if (orders) {
              for (let i = 0; i < orders.length; i++) {
                let today = orders[i].order.date;
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, "0");
                let day = String(today.getDate()).padStart(2, "0");
                orders[i].order.date = `${day}-${month}-${year}`;
              }
              res.render("admin/sales", { orders, admin: true ,salesp:true});
            } else {
              res.render("admin/sales", { orders, admin: true,salesp:true });
            }
          });
        } catch (err) {
          console.log("Error getting showing orders", err);
        }
      },
      getAllUsers:(req, res)=>{
        return new Promise((resolve,reject)=>{
            userCollection.find().then((allUsers)=>{
                res.status(200).json(allUsers);
            }).catch((err)=>{
                console.log(err);
                reject(err)
            })
            
        })
        },
      getAllProducts:(req, res)=>{
        return new Promise((resolve,reject)=>{
            prodColl.find().then((allProds)=>{
                console.log(allProds.length,"rpod-=-==")
                res.status(200).json(allProds);
            }).catch((err)=>{
                console.log(err);
                reject(err)
            })
            
        })
      },
    //   getAllOrders:(req, res)=>{
    //     return new Promise((resolve,reject)=>{
    //         ordersCollection.find().lean().exec().then((orders)=>{
    //             let orderLength = 0
    //             orders.map((arr)=>{
    //                 orderLength += arr.order.length  
    //             })
    //             console.log(orderLength,"-=-=-==-=-orders")
    //             res.status(200).json(orderLength);
    //         }).catch((err)=>{
    //             console.log(err);
    //             reject(err)
    //         })
            
    //     })
    //   },




}