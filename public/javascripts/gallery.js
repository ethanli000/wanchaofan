var is_img_loading = 0;
var img_space_ratio = 0.8;
var prev_series = "";
var next_series = "";
var current_sort = 1;
var max_sort = 1;
var photo_ratio = 1;


var init = function () {
  photo_ratio = $(".photo img").width() / $(".photo img").height();
  if ($("li.selected").next().length > 0) {
    next_series = $("li.selected").next().children("a").attr("href");
  }
  if ($("li.selected").prev().length > 0) {
    prev_series = $("li.selected").prev().children("a").attr("href");
  }
  current_sort = parseInt($("span.photo-sort").text(), 10);
  max_sort = parseInt($("span.photo-max").text(), 10);
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
    $(".photo").width(gallery_height * img_space_ratio * photo_ratio);
    $(".photo img").height(gallery_height * img_space_ratio);
    $(".photo img").width(gallery_height * img_space_ratio * photo_ratio);
    $(".photo img").css("margin-top", gallery_height * (0.5 - img_space_ratio / 2));
    $(".photo-count").width(gallery_height * img_space_ratio * photo_ratio);
    $(".photo-count").css("bottom", gallery_height * (0.25 - img_space_ratio / 4));
  } else {
    //80% width
    //$(".photo").height(gallery_width * 0.8 / photo_ratio);
    $(".photo").width(gallery_width * img_space_ratio);
    $(".photo img").height(gallery_width * img_space_ratio / photo_ratio);
    $(".photo img").width(gallery_width * img_space_ratio);
    $(".photo img").css("margin-top", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2);
    $(".photo-count").width(gallery_width * img_space_ratio);
    $(".photo-count").css("bottom", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 4);
  }
  return true;
};

var update_img = function () {
  //alert(current_sort);
  $.ajax({
    async: true,
    method: "POST",
    dataType: "json",
    url: window.location.href,
    data: {sort: current_sort},
    beforeSend: function () {
      is_img_loading = 1;
    },
    success: function (res) {
      if (res.result === "success") {
        $("<img/>").attr("src", res.data.url).load(function () {
          photo_ratio = this.width / this.height;
          setSize();
          $(".photo img").attr("src", res.data.url);
        });
        $("span.photo-sort").text(current_sort);
      } else {
        //$(".error-message").text("ADD FAILED: " + res.message);
      }
    },
    error: function () {
      //$(".error-message").text("ADD FAILED: server error!");
    },
    complete: function () {
      is_img_loading = 0;
    },
  });
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
  if(is_img_loading) {
    return false;
  }
  if(current_sort === 1) {
    if(prev_series !== "") {
      window.location.href = prev_series;
    }
    return false;
  }

  //update img file
  current_sort--;
  update_img();
});

$(document).on("click", ".go-right", function () {
  if(is_img_loading) {
    return false;
  }
  if(current_sort === max_sort) {
    if(next_series !== "") {
      window.location.href = next_series;
    }
    return false;
  }

  //update img file
  current_sort++;
  update_img();
});
