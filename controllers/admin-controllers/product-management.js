const productHelper = require('../../helpers/product-helpers/product-helper');
const categoryHelper = require('../../helpers/product-helpers/category-helper');
const product = require("../../models/product-model");
module.exports = {

    showProducts: (req, res, next) => {
        productHelper.showProducts().then((products) => {
            res.render('admin/products', {products,admin:true});
        })
    },
    
    getEditProduct: (req, res, next) => {
        let id = req.params.id;
        console.log(id);
        productHelper.findProductById(id).then((product) => {
            categoryHelper.allCategory().then((category) => {
                res.render('admin/edit-product', {product, category, admin:true})
            })
        })
    },

    postEditProduct: (req, res, next) => {
        let id = req.params.id;
        let productDetails = req.body;
        let image = req.files;


        productHelper.updateProductById(id, productDetails, image).then((response)=> {
            if(response){
                res.redirect('/admin/products');
            }
        })
    },
    softDeleteProduct: (req, res, next) => {
        const productId = req.params.id;
      
        product.findByIdAndUpdate(productId, { deleted: true }).then(() => {
            console.log('Product deleted');
          res.redirect('/admin/products');
        }).catch((err) => {
          console.log('Error while soft deleting product: ' + err);
          res.redirect('/admin/products');
        });
      },
      hideunhideproduct: (req, res) => {
        try {
            let id = req.params.id;
            productHelper.hideunhideprod(id).then((result) => {
                res.redirect('/admin/products/');
                if (result) {
                console.log('PRODUCT HIDDEN '+ req.params.id);
              }else {
                  console.log('PRODUCT UNHIDDEN '+ req.params.id);
                }
            });
        } catch (err) {
            console.log(err.message);
        }
    },
      

}