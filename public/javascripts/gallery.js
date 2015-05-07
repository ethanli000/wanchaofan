var photo_ratio = 1;
var prev_series = "";
var next_series = "";
var current_sort = 1;

var init = function () {
  photo_ratio = $(".photo img").width() / $(".photo img").height();
  if ($("li.selected").next().length > 0) {
    next_series = $("li.selected").next().children("a").attr("href");
  }
  if ($("li.selected").prev().length > 0) {
    prev_series = $("li.selected").prev().children("a").attr("href");
  }
};

var setSize = function () {
  var gallery_height = $(".gallery").height();
  var gallery_width = $(".gallery").width();
  var gallery_radio = gallery_width / gallery_height;
  $(".go-left").height(gallery_height);
  $(".go-right").height(gallery_height);
  if (photo_ratio <= gallery_radio) {
    //80% height
    //$(".photo").height(gallery_height * 0.8);
    $(".photo").width(gallery_height * 0.8 * photo_ratio);
    $(".photo img").height(gallery_height * 0.8);
    $(".photo img").width(gallery_height * 0.8 * photo_ratio);
    $(".photo img").css("margin-top", gallery_height * 0.1);
    $(".photo-count").width(gallery_height * 0.8 * photo_ratio);
    $(".photo-count").css("bottom", gallery_height * 0.05);
  } else {
    //80% width
    //$(".photo").height(gallery_width * 0.8 / photo_ratio);
    $(".photo").width(gallery_width * 0.8);
    $(".photo img").height(gallery_width * 0.8 / photo_ratio);
    $(".photo img").width(gallery_width * 0.8);
    $(".photo img").css("margin-top", (gallery_height - gallery_width * 0.8 / photo_ratio) / 2);
    $(".photo-count").width(gallery_width * 0.8);
    $(".photo-count").css("bottom", (gallery_height - gallery_width * 0.8 / photo_ratio) / 4);
  }
  return true;
};

$(window).load(function () {
  //alert($(".photo img").width());
  init();

  setSize();
});

$(window).on("resize", function () {
  setSize();
});

$(document).on("click", ".go-left", function () {
  alert("left");
});

$(document).on("click", ".go-right", function () {
  alert("right");
});

// $(document).on("click", "#add-series", function () {
//   var name = $("#new-series-name").val();
//   $(".error-message").text("");
//   if (!name || name === "") {
//     $(".error-message").text("please fill a series name before add.");
//     return false;
//   }
//   var check = confirm('Do you really want to add a series "' + name + '"?');
//   if (!check) {
//     return false;
//   }
//   $.ajax({
//     async: true,
//     method: "POST",
//     dataType: "json",
//     url: "/admin/series/add",
//     data: {name: name},
//     beforeSend: function () {
//       $("#add-series").attr("disabled", "disabled").addClass("disabled");
//     },
//     success: function (res) {
//       if (res.result === "success") {
//         var new_series = '<div class="series clearfix"><input type="hidden" value="';
//         new_series += res.data.series_key + '" name="key"><span class="name">';
//         new_series += res.data.name + '</span><input type="button" name="hide" value="HIDE" class="series-botton"><input type="button" name="delete" value="DELETE" class="series-botton"></div>';
//         $(".new-series").before(new_series);
//         $("#new-series-name").val("");
//       } else {
//         $(".error-message").text("ADD FAILED: " + res.message);
//       }
//     },
//     error: function () {
//       $(".error-message").text("ADD FAILED: server error!");
//     },
//     complete: function () {
//       $("#add-series").removeAttr("disabled").removeClass("disabled");
//     },
//   });
// });

