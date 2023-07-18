const session = require("express-session");

module.exports = {
  getDashboard: (req, res, next) => {
    res.render("admin/dashboard", { admin: true });
  },
};
