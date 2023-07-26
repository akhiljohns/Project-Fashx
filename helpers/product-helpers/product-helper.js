const product = require("../../models/product-model"); // Assuming the product model is defined in "../models/product.js"
const { ObjectId } = require('mongoose').Types;
const sharp = require('sharp');
const mongoose = require('mongoose');
const fs=require('fs');
const categoryColl = require("../../models/category-model");


module.exports = {
 



addProduct: async (productDetails, images) => {
  try {
    const imageFiles = [];

    for (const image of images) {
      const { filename } = image;

      if (image.mimetype === 'image/gif') {
        // Handle GIF images separately
        imageFiles.push(filename);
        continue;
      }

      const processedImage = await sharp(image.path)
        .resize(800, 800, { fit: 'cover' })
        .jpeg()
        .toFile(`public/uploads/${filename}.jpg`);
      
      imageFiles.push(`${filename}.jpg`);
    }

    const newProduct = new product({
      productName: productDetails.prodtitle,
      description: productDetails.proddescr,
      regularPrice: productDetails.prodrprice,
      discount: productDetails.proddiscount,
      stock: productDetails.prodstock,
      category: productDetails.prodcategory,
      brand: productDetails.prodbrand,
      image: imageFiles,
    });

    await newProduct.save();
    return;
  } catch (err) {
    console.log(err);
  }
},

  // addProduct: async (productDetails, images) => {
  //   try {
  //     const imageFiles = images.map(image => image.filename);
  //     const newProduct = new product({
  //       productName: productDetails.prodtitle,
  //       description: productDetails.proddescr,
  //       regularPrice: productDetails.prodrprice,
  //       discount: productDetails.proddiscount,
  //       stock: productDetails.prodstock,
  //       category: productDetails.prodcategory,
  //       brand: productDetails.prodbrand,
  //       image: imageFiles,
  //     });

  //     await newProduct.save();
  //     return;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },

  showProducts: () => {
    return new Promise((resolve, reject) => {
      product.find({ deleted: false }).populate('category').lean().then((products) => {
        resolve(products);
      });
    });
  },
  deleteImg: (imgId, productId) => {
    return new Promise((resolve, reject) => {
      product.updateOne({ _id: productId },{ $pull: { image: imgId } }).then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  
  
//   showProductsUser: () => {
//     return new Promise((resolve, reject) => {

//       product.find({ hidden: false }).populate('category').lean().then((products) => {

         
//         console.log("SHOW PRODUCTS-----===>",products)
//         resolve(products);
//       }).catch((err) => 
// console.log("show product err ",err)
//       );
//     });
//   },
showProductsUser:  () => {
  return new Promise( async (resolve, reject) => {
    let categories = await categoryColl.find().lean().exec();

    product.find({ hidden: false }).populate('category').lean().then((products) => {
      console.log("SHOW PRODUCTS-----===>", products);
      
      // Filter categories with hidden field value equal to true
      const filteredProducts = products.filter((product) => {
        return product.category.hiddenstatus === false;
      });
      
      
      console.log("show categories",categories);
      resolve(filteredProducts);
    }).catch((err) => {
      console.log("show product err ", err);
      reject(err);
    });
  });
},


  findProductById: (id) => {
    return new Promise((resolve, Reject) => {
      product.findById(id).populate('category').lean().exec().then((product) => {
        console.log("EDITING PRODUCT :");
        console.log(product);
        resolve(product);
      });
    });
  },


 /* The `findProductByIdUser` function is used to find a product by its ID and populate the `category`
 field with the corresponding category document. */
  findProductByIdUser: (id) => {
    return new Promise((resolve, Reject) => {
      product.findOne({_id: id}).populate('category').lean().exec().then((product) => {
        resolve(product);
      }).catch((err)=> {
        console.log('Error in singl:::::', err);
      })
    });
  },



  // updateProductById: (id, productDetails, images) => {
  //   return new Promise(async (resolve, Reject) => {
  //     console.log(id, productDetails, images);
  //     try {
        
  //       const updateFields = {
  //         productName: productDetails.prodtitle,
  //         description: productDetails.proddescr,
  //         regularPrice: productDetails.prodrprice,
  //         discount: productDetails.proddiscount,
  //         stock: productDetails.prodstock,
  //         brand: productDetails.prodbrand,
  //         category: productDetails.prodcategoryid // Use the existing category ObjectId value
  //       };
  
  //       if (images && images.length) {
  //         const imageFiles = images.map(image => image.filename)
  //         updateFields.image = imageFiles;
  //       }
  
  //       const updatedProduct = await product.updateOne(
  //         { _id: new ObjectId(id) },
  //         { $set: updateFields }
  //       );
  
  //       resolve(updatedProduct);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // },

  updateProductById: (id, productDetails, images) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateFields = {
          productName: productDetails.prodtitle,
          description: productDetails.proddescr,
          regularPrice: productDetails.prodrprice,
          discount: productDetails.proddiscount,
          stock: productDetails.prodstock,
          brand: productDetails.prodbrand,
          category: productDetails.prodcategoryid // Use the existing category ObjectId value
        };
  
        if (images && images.length) {
          const imageFiles = [];
  
          for (const image of images) {
            const { filename } = image;
  
            const processedImage = await sharp(image.path)
              .resize(800, 800, { fit: 'cover' })
              .jpeg()
              .toFile(`public/uploads/${filename}.jpg`);
  
            imageFiles.push(`${filename}.jpg`);
          }
  
          updateFields.image = imageFiles;
        }
  
        const updatedProduct = await product.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateFields }
        );
  
        resolve(updatedProduct);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  
  
  getStock: (productId) => {
    return new Promise ((resolve, reject) => {
      product.findOne({_id: productId}).lean().then((product) => {
        resolve(product.stock);
      }).catch((error) => {
        console.log('Search stock failed: ', error);
        resolve(false);
      })
    })
  },
  hideunhideprod: async (id) => {
    try {  
        const productItems = await product.findOne({ _id: id });
    
        if (productItems.hidden) {
          await product.updateOne({ _id: id }, { $set: { hidden: false } });
          return false;
        } else {
          await product.updateOne({ _id: id }, { $set: { hidden: true } });
          return true;
        }
      } catch (err) {
        console.log(err.message);
        throw err;
      }
    },

  
    searchProduct: (keyword) => {
      try {
        return new Promise((resolve, reject) => {
       
          const query = product.find({ productName: { $regex: keyword, $options: 'i' } });

          // Fetch the products for the current page
          const productsPromise = query
           .lean()
            .exec();
  
          Promise.all([productsPromise]).then(([products]) => {
              resolve({ products });
            })
            .catch(error => {
              reject(error);
            });
        });
      } catch (error) {
        console.log('Search product failed: ', error);
        throw error;
      }
    },

    categorise: (category) => {
      try {
        return new Promise((resolve, reject) => {
          let query
          if(category === 'all'){

             query = product.find({});
          }else{
           query = product.find({ category: category });
          }
          // Fetch the products for the current page
          const productsPromise = query
           .lean()
            .exec();
  
          Promise.all([productsPromise]).then(([products]) => {
              resolve({ products });
            })
            .catch(error => {
              reject(error);
            });
        });
      } catch (error) {
        console.log('Search product on category failed: ', error);
        throw error;
      }
    },
};
