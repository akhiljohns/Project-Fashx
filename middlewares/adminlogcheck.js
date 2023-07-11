const session = require('express-session');


module.exports = {
    check: (req, res, next)=> {
        
        if(req.session.adminlog) {
          res.redirect('/admin/dashboard')
        } else {
            next()
        }
    },

    logStatus: (req, res, next)=> {
       
        if(req.session.adminlog) {
            next()
        } else {
            res.redirect('/admin/signin')
        }
    }
}