const session = require("express-session");
const adminHelper = require("../../helpers/admin-helpers/user-helper");
const userHelper = require("../../helpers/admin-helpers/user-helper")

module.exports = {             

  getUsers: async (req, res) => {
    await userHelper.allCustomers().then((customers) => {
      res.render('admin/users', {admin:true, customers});
    })
}
}



