const { ObjectId } = require('mongodb');
const category = require('../../models/category-model');
const product = require('../../models/product-model');


module.exports = {

    addCategory: (categoryData) => {
        try{
            return new Promise(async (resolve, reject) => {
                let categories = new category(categoryData);
                await categories.save().then((result) => {
                    resolve(result);
                })
            })              
        } catch(err){
            console.log('Error while adding category: ' + err);
        }         
    },
    getCategoryByName: (name) => {
        try {
          return category.findOne({ name: name });
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

}