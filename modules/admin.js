var Mongolian = require("mongolian");

// Constructor
function Admin() {
  this.db = new Mongolian(process.env.NODE_DB);
}

Admin.prototype.login = function (user, pass, display) {
  var info = this.db.collection('info');
  info.findOne({}, function (err, site_info) {
    console.log(err);
    //console.log(site_info);
    if (!err && site_info) {
      if (user !== site_info.admin_id || pass !== site_info.password) {
        display("failed");
      } else {
        display("success");
      }
    } else {
      display("error");
    }
  });
};

Admin.prototype.getInfo = function (next) {
  var info = this.db.collection('info');
  info.findOne({}, function (err, site_info) {
    if (!err && site_info) {
      //console.log("get info ok: " + JSON.stringify(site_info));
      next(site_info);
    } else {
      console.log("get info error: " + JSON.stringify(err));
      next("error");
    }
  });
};

Admin.prototype.changeInfo = function (update_data, next) {
  //console.log("update info: " + JSON.stringify(update_data));
  var info = this.db.collection('info');
  info.findAndModify({query: {}, update: update_data, new: true}, function (err, site_info) {
    if (!err && site_info) {
      //console.log("new info: " + JSON.stringify(site_info));
      next(site_info);
    } else {
      console.log("update info error: " + JSON.stringify(err));
      next("error");
    }
  });
};

module.exports = new Admin();