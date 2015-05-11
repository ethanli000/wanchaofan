var Mongolian = require("mongolian");

// Constructor
function Series() {
  this.db = new Mongolian(process.env.NODE_DB);
}

Series.prototype.getList = function (next) {
  var series = this.db.collection('series');
  series.find({ is_delete: 0 }, {_id: 0, create_time: 0}).toArray(function (err, series_list) {
    if (!err && series_list) {
      //console.log(series_list);
      next(series_list);
    } else {
      console.log("get series list error: " + JSON.stringify(err));
      next("error");
    }
  });
};

Series.prototype.getInfo = function (series_key, next) {
  var series = this.db.collection('series');
  //console.log(series_key);
  series.findOne({ series_key: parseInt(series_key, 10) }, function (err, series_info) {
    //console.log(series_info);
    if (!err && series_info) {
      next(series_info);
    } else {
      console.log("get series error: " + JSON.stringify(err));
      next("error");
    }
  });
};

Series.prototype.add = function (series_name, next) {
  var series = this.db.collection('series');
  var counter = this.db.collection('counter');
  counter.findAndModify({query: { _id: "series_key" }, update: { $inc: { seq: 1 } }, new: true, upsert: true }, function (err, key) {
    if (!err && key) {
      var new_data = {series_key: key.seq, name: series_name, photo_count: 0, is_show: 1, is_delete: 0, create_time: Math.floor(new Date() / 1000)};
      series.findAndModify({query: { series_key: key.seq }, update: new_data, new: true, upsert: true }, function (err, new_series) {
        if (!err && new_series) {
          //console.log(new_series);
          next({result: "success", data: new_series});
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

Series.prototype.update = function (series_key, update_data, next) {
  var series = this.db.collection('series');
  series.findAndModify({query: { series_key: parseInt(series_key, 10) }, update: {$set: update_data}, upsert: false, new: true }, function (err, new_data) {
    if (!err && new_data) {
      //console.log("new data: " + JSON.stringify(new_data));
      next({result: "success"});
    } else {
      console.log("update series error: " + JSON.stringify(err));
      next({result: "error", message: "update data error"});
    }
  });
};

module.exports = new Series();