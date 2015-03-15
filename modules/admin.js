var Mongolian = require("mongolian");

// Constructor
function Admin() {
  this.db = new Mongolian("mongodb://wcfadmin:8ffae097a0@ds029960.mongolab.com:29960/wanchaofan");
}

Admin.prototype.login = function (user, pass, display) {
  var info = this.db.collection('info');
  info.findOne({}, function (err, site_info) {
    console.log(err);
    console.log(site_info);
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

Admin.prototype.displayInfo = function (display) {
  var info = this.db.collection('info');
  info.findOne({}, function (err, site_info) {
    console.log(err);
    console.log(site_info);
    if (!err && site_info) {
      display(site_info);
    } else {
      display("error");
    }
  });
};

Admin.prototype.changeInfo = function (body, display) {
  console.log(body);
  // var info = this.db.collection('info');
  // info.findOne({}, function (err, site_info) {
  //   console.log(err);
  //   console.log(site_info);
  //   if (!err && site_info) {
  //     display(site_info);
  //   } else {
  //     display("error");
  //   }
  // });
  display(false);
};

module.exports = new Admin();