var Mongolian = require("mongolian");

// Constructor
function Photo() {
  this.db = new Mongolian("mongodb://wcfadmin:8ffae097a0@ds029960.mongolab.com:29960/wanchaofan");
}

Photo.prototype.getList = function (series_key, next) {
  var photo = this.db.collection('photo');
  photo.find({ is_delete: 0, series_key: parseInt(series_key, 10) }, {_id: 0, create_time: 0}).sort({ photo_sort: 1 }).toArray(function (err, photo_list) {
    if (!err && photo_list) {
      //console.log(photo_list);
      next(photo_list);
    } else {
      console.log("get photo list error: " + JSON.stringify(err));
      next("error");
    }
  });
};

Photo.prototype.getInfo = function (series_key, photo_sort, next) {
  var photo = this.db.collection('photo');
  //console.log(series_key);
  photo.findOne({ series_key: parseInt(series_key, 10), photo_sort: parseInt(photo_sort, 10),  }, function (err, photo_info) {
    if (!err && photo_info) {
      next(photo_info);
    } else {
      console.log("get photo url error: " + JSON.stringify(err));
      next("error");
    }
  });
};

Photo.prototype.add = function (series_key, sort, file_path, next) {
  //console.log(series_key);
  //console.log(file_path);
  var photo = this.db.collection('photo');
  var counter = this.db.collection('counter');
  var series = this.db.collection('series');
  counter.findAndModify({query: { _id: "photo_key" }, update: { $inc: { seq: 1 } }, new: true, upsert: true }, function (err, key) {
    if (!err && key) {
      var new_data = {
          photo_key: key.seq,
          series_key: parseInt(series_key, 10),
          photo_sort: parseInt(sort, 10) + 1,
          url: file_path,
          is_show: 1,
          is_delete: 0,
          create_time: Math.floor(new Date() / 1000)
        };
      photo.findAndModify({query: { photo_key: key.seq }, update: new_data, new: true, upsert: true }, function (err, new_photo) {
        if (!err && new_photo) {
          console.log(new_photo);
          // update series photo count
          series.findAndModify({query: { series_key: parseInt(series_key, 10) }, update: { $inc: { photo_count: 1 } }, new: true, upsert: true }, function (err, series) {
            if (err || !series) {
              console.log("update series error: " + JSON.stringify(err));
            }
            next({result: "success", data: new_photo});
          });
        } else {
          console.log("add series error: " + JSON.stringify(err));
          next({result: "error", message: "add error"});
        }
      });
    } else {
      console.log("add series error: " + JSON.stringify(err));
      next({result: "error", message: "add error"});
    }
  });
};

// Photo.prototype.update = function (series_key, update_data, next) {
//   var series = this.db.collection('series');
//   series.findAndModify({query: { series_key: parseInt(series_key, 10) }, update: {$set: update_data}, upsert: false, new: true }, function (err, new_data) {
//     if (!err && new_data) {
//       //console.log("new data: " + JSON.stringify(new_data));
//       next({result: "success"});
//     } else {
//       console.log("update series error: " + JSON.stringify(err));
//       next({result: "error", message: "update data error"});
//     }
//   });
// };

module.exports = new Photo();