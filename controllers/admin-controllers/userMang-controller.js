const userHelper = require("../../helpers/admin-helpers/user-helper");

module.exports = {

  blockUnblockUser: async (req, res, next) => {
    try {
      const id = req.params.id;

      const isBlocked = await userHelper.checkBlockStatus(id);
      console.log("block status: " + isBlocked);

      res.redirect("/admin/users");
    } catch (err) {
      console.log(err);
      next(err);
    }
  },


  deleteUser: async (req, res, next) => {
    try {
      const id = req.params.id;

 const deleted = await userHelper.deleteUser(id);
     
      res.redirect("/admin/users");
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
};
