const session = require("express-session");
const adminHelper = require("../../helpers/admin-helpers/user-helper");
const userHelper = require("../../helpers/admin-helpers/user-helper")

module.exports = {             

  // getUsers: (req, res) => {
  //   res.render("admin/users" ,{admin:true});
  // },

  getUsers: async (req, res) => {
    await userHelper.allCustomers().then((customers) => {
      console.log(customers);
      res.render('admin/users', {admin:true, customers});
    })
}
}



