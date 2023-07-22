const category = require("../../models/category-model");
const products = require("../../models/product-model");

//imported Helpers
const categoryHelper = require("../../helpers/product-helpers/category-helper");

module.exports = {

  addCategory: async (req, res, next) => {
    let categoryData = req.body;
    console.log("Category Name :" + categoryData.name);

    try {
      const existingCategory = await categoryHelper.getCategoryByName(
        categoryData.name
      );

      if (existingCategory) {
        let cate = categoryData.name;
        console.log("Category already exists");
        await categoryHelper.allCategory().then((category) => {
          res.render("admin/categories", {
            category,
            admin: true,
            catext: true,
            cate,
          });
        });
      } else {
        await categoryHelper.addCategory(categoryData);
        console.log("Category added successfully");
        res.redirect("/admin/categories");
      }
    } catch (err) {
      console.log("Error while adding category: " + err);
    }
  },


  allCategories: async (req, res) => {
    await categoryHelper.allCategory().then((category) => {
      res.render("admin/categories", { category, admin: true });
    });
  },


  deleteCategory: (req, res, next) => {
    try {
      let id = req.params.id;
      categoryHelper.deleteCategory(id).then((result) => {
        res.redirect("/admin/categories");
        console.log("CATEGORY DELETED" + req.params.id);
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  
  hideunhide: (req, res) => {
    try {
      let id = req.params.id;
      categoryHelper.hideunhidecat(id).then((result) => {
        res.redirect("/admin/categories");
        if (result) {
          console.log("CATEGORY HIDDEN " + req.params.id);
        } else {
          console.log("CATEGORY UNHIDDEN " + req.params.id);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};
