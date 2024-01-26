const { ObjectId } = require('mongodb');
const category = require('../../models/category-model');
const product = require('../../models/product-model');


module.exports = {

    addCategory: (categoryData) => {
        try{
            return new Promise(async (resolve, reject) => {
                let categories = new category(categoryData);
                console.log(categories)
                await categories.save().then((result) => {
                    resolve(result);
                })
            })              
        } catch(err){
            console.log('Error while adding category: ' + err);
        }         
    },
    getCategoryByName: async (name) => {
        try {
          const regex = new RegExp(`^${name}$`, 'i'); // Create a case-insensitive regex pattern
          return category.findOne({ name: regex });
        } catch (err) {
          console.log('Error while getting category by name: ' + err);
        }
      },
      

    allCategory: () => {
        try{
            return new Promise(async (resolve, reject) => {
                let categories = await category.find().lean().exec();
                resolve (categories);
            })
        } catch(err){
            console.log('Error while fetching categories: ' + err);
        }
    },

    
    deleteCategory: (id) => {
        try{
            return new Promise((resolve, reject) => {
                category.deleteOne(_id = new ObjectId(id)).then((response) => {
                    resolve (response);
                })
            })
        } catch (err) {
            console.log('error while deleting category: ' + err);
        }
    },
    hideunhidecat: async (id) => {
        try {  
            const categories = await category.findOne({ _id: id });
        
            if (categories.hiddenstatus) {
              await category.updateOne({ _id: id }, { $set: { hiddenstatus: false } });
              return false;
            } else {
              await category.updateOne({ _id: id }, { $set: { hiddenstatus: true } });
              return true;
            }
          } catch (err) {
            console.log(err.message);
            throw err;
          }
        },

}