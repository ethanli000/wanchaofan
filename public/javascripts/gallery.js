/* global variables */
var is_img_loading = 0;
var img_space_ratio = 0.8;
var prev_series = "";
var next_series = "";
var current_sort = 1;
var max_sort = 1;
var photo_ratio = 1;
/* functions */
var init = function () {
  //photo_ratio = $(".photo img").width() / $(".photo img").height();
  if ($("li.selected").length > 0) {
    if ($("li.selected").next().length > 0) {
      next_series = $("li.selected").next().children("a").attr("href");
    }
    if ($("li.selected").prev().length > 0) {
      prev_series = $("li.selected").prev().children("a").attr("href");
    }
    current_sort = parseInt($("span.photo-sort").text(), 10);
    max_sort = parseInt($("span.photo-max").text(), 10);
  } else {
    current_sort = 0;
    max_sort = 0;
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
    $(".photo").width(gallery_height * img_space_ratio * photo_ratio);
    //img
    $(".photo img").height(gallery_height * img_space_ratio);
    $(".photo img").width(gallery_height * img_space_ratio * photo_ratio);
    $(".photo img").css("margin-top", gallery_height * (0.5 - img_space_ratio / 2));
    //spin
    $(".spin-container").css("top", gallery_height * (0.5 - img_space_ratio / 2));
    $(".spin-container").width($(".photo img").width());
    $(".spin-container").height($(".photo img").height());
    //count
    $(".photo-count").width($(".photo img").width());
    $(".photo-count").css("bottom", gallery_height * (0.5 - img_space_ratio / 2) - 30);
  } else {
    //80% width
    $(".photo").width(gallery_width * img_space_ratio);
    //img
    $(".photo img").height(gallery_width * img_space_ratio / photo_ratio);
    $(".photo img").width(gallery_width * img_space_ratio);
    $(".photo img").css("margin-top", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2);
    //spin
    $(".spin-container").css("top", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2);
    $(".spin-container").width($(".photo img").width());
    $(".spin-container").height($(".photo img").height());
    //count
    $(".photo-count").width($(".photo img").width());
    $(".photo-count").css("bottom", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2 - 30);
  }
  return true;
};

var spin_start = function () {
  var opt = {
    lines: 7, // The number of lines to draw
    length: 8, // The length of each line
    width: 5, // The line thickness
    radius: 6, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000000', // #rgb or #rrggbb or array of colors
    speed: 1.2, // Rounds per second
    trail: 30, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 100, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };
  $('#spin').spin(opt);
  $(".spin-container").css("z-index", "100");
};
var spin_stop = function () {
  $('#spin').spin(false);
  $(".spin-container").css("z-index", "-1");
  is_img_loading = 0;
};

var update_img = function () {
  $.ajax({
    async: true,
    method: "POST",
    dataType: "json",
    url: window.location.href,
    data: {sort: current_sort},
    beforeSend: function () {
      spin_start();
    },
    success: function (res) {
      if (res.result === "success") {
        $("<img/>").attr("src", res.data.url).load(function () {
          photo_ratio = this.width / this.height;
          setSize();
          $(".photo img").attr("src", res.data.url);
          $("span.photo-sort").text(current_sort);
          spin_stop();
        });
      } else {
        spin_stop();
        //$(".error-message").text("ADD FAILED: " + res.message);
      }
    },
    error: function () {
      spin_stop();
      //$(".error-message").text("ADD FAILED: server error!");
    },
    // complete: function () {
    // },
  });
};

var is_img_loading_check = function () {
  if (is_img_loading) {
    return false;
  }
  is_img_loading = 1;
  return true;
};

var go_left = function () {
  if (current_sort === 1) {
    current_sort = max_sort;
  } else {
    current_sort--;
  }
  //update img file
  update_img();
  return true;
};
var go_right = function () {
  if (current_sort === max_sort) {
    current_sort = 1;
  } else {
    current_sort++;
  }
  //update img file
  update_img();
  return true;
};

/* events */
$(document).ready(function () {
  init();
  $(".photo").width("100%");
  $(".spin-container").width("100%");
  $(".spin-container").height("100%");
  $(".spin-container").css("opacity", "1");
  spin_start();
  var img_src = $(".photo img").attr("src");
  $(".photo img").attr("src", "");
  $("<img/>").attr("src", img_src).load(function () {
    photo_ratio = this.width / this.height;
    setSize();
    spin_stop();
    $(".spin-container").css("opacity", "0.7");
    $(".photo img").attr("src", img_src);
  });
});

$(window).load(function () {
  setSize();
});

$(window).on("resize", function () {
  setSize();
});

$(document).on("click", ".go-left", function () {
  if (is_img_loading_check()) {
    go_left();
  }
});

$(document).on("click", ".go-right", function () {
  if (is_img_loading_check()) {
    go_right();
  }
});

//mobile swipe
$(document).on("swipeleft", ".gallery", function (event) {
  event.stopImmediatePropagation();
  if (is_img_loading_check() && max_sort && !is_mobile_menu_on) {
    // $(".photo").stop().animate({left: '-=10px'}, 200, "linear").stop().animate({left: '50%'}, 150, "linear", function () {
    //   go_right();
    // });
    go_right();
  }
});

$(document).on("swiperight", ".gallery", function (event) {
  event.stopImmediatePropagation();
  if (is_img_loading_check() && max_sort && !is_mobile_menu_on) {
    // $(".photo").stop().animate({left: '+=10px'}, 200, "linear").stop().animate({left: '50%'}, 150, "linear", function () {
    //   go_left();
    // });
    go_left();
  }
});

$(document).on("tap", ".photo img", function (event) {
  //event.stopPropagation();
  if (is_img_loading_check() && max_sort && !is_mobile_menu_on) {
    // $(".photo").stop().animate({left: '-=10px'}, 200, "linear").stop().animate({left: '50%'}, 150, "linear", function () {
    //   go_right();
    // });
    go_right();
  }
});
