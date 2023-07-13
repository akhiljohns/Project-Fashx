const profileHelper = require('../../helpers/user-helpers/profile-helper');
const userHelper = require('../../helpers/user-helpers/user-helper');



module.exports = {
  updateProfile: (req, res, next) => {
    const userId = req.session.user._id;
    const newData = req.body;
    console.log("<=-----USEDATA-----=>", req.body);

    profileHelper.updateProfile(userId, newData).then((response) => {
      console.log("<=-----USER DATA UPDATED-----=>");
      res.redirect("/profile");
    });
  },

  addAddress: (req, res, next) => {
    const address = req.body;
    console.log("<=-----ADDRESS-----=>", address);
    userHelper.addAddress(req.session.user._id, address).then((response) => {
      console.log(response);
      req.session.user.address = response;
      console.log("user address: ", req.session.user);
      res.redirect("/profile");
    });
  },

  deleteAddress: (req, res, next) => {
      const id = req.params.id;
      const userId = req.session.user._id;
      userHelper.deleteAddress(id, userId).then((response) => {
          console.log('delete response'+response);
          res.redirect('/profile');
      })
  },

//   /* `getAnAddress` is a function that handles a GET request to retrieve a single address from a
//   user's list of addresses. It takes in the request (`req`), response (`res`), and next middleware
//   function (`next`) as parameters. */
//   getAnAddrress: (req, res, next) => {
//       try{
//           const addressId = req.body.addressId;
//           const userId = req.session.user._id;
//           let address;
//           userHelper.getAddress(userId).then((response) => {
//               let addressList = response.address;
//               console.log(addressList);
//               for(let i=0; i<addressList.length; i++) {
//                   if(addressList[i]._id == addressId) {
//                       address = addressList[i];
//                       break;
//                   }
//               }
//               console.log('single adddress::', address);
//               res.status(200).json(address);
//           })
//       } catch (err) {
//           console.log('Error getting single address ::', err);
//       }
//   }
};