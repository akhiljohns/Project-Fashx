const productHelper = require('../../helpers/product-helpers/product-helper');
const carthelper = require('../../helpers/product-helpers/cart-helper')
module.exports = {

    showProducts: (req, res, next) => {
        productHelper.showProductsUser().then((products) => {
            res.render('user/products', {products,user: req.session.user});
        }).catch((err) =>{
            console.log("prd rende err",err);
        })
    },
    
    getSinPro: (req, res, next) => {
        console.log(req.session.user);
        let userId = req.session.user._id;
        let prodid = req.params.id;
    
        productHelper.findProductByIdUser(prodid).then((product) => {
       
            console.log("<=-------SINGLE PRODUCT PAGE---------=>", product);
            carthelper.checkProduct(userId, product).then((response) => {
                console.log("on cart response :",response);
                if (response) {
                    res.render('user/single-product', { product, oncart: true, user: req.session.user });
                } else {
                    res.render('user/single-product', { product, oncart: false, user: req.session.user });
                }
            });
        });
    }
    
}