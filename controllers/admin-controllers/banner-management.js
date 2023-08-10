// importing helpers
const bannerHelper = require('../../helpers/admin-helpers/banner-helper');


module.exports = {

    getAddBanner: (req, res) => { 

        try{
        // res.render('admin/addbanner',{admin:true})
        // res.send('success');
        res.render('admin/addbanner');
        } catch(e){
            console.log('error is ', e);
        }
        
    },

    addbanner: (req, res, next)=> {
        const bannerDetails = {
            name : req.body.name,
            subTitle : req.body.subTitle,
            button : req.body.button,
        };
        
        bannerImage = req.file;

        bannerHelper.addbanner(bannerDetails, bannerImage).then((response)=> {
            if(!response.error){
                res.redirect('/admin/banner');
            } else {
                res.redirect('/admin')
            }
        })
    },

    getBanner: (req, res, next)=> {
        bannerHelper.getBanner().then((banner)=> {
            if(!banner.error) {
                res.render('admin/banner', {admin: true, banner});
            } else {
                res.redirect('/admin');
            }
        }).catch((err)=> {
            console.log('Error in getting banners(cotroller)', err);
            res.redirect('/admin');
        })
    },


    removebanner: (req, res, next)=> {
        const bannerId = req.body.bannerId;
        bannerHelper.removebanner(bannerId).then((response)=> {
            res.status(200).json({status: response.status});
        }).catch((err)=> {
            console.log('error in controller removing banner', err);
            res.status(200).json({status:false});
        })
    }
}