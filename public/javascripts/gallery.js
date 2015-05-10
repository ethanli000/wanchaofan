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

    $(".spin-container").css("top", gallery_height * (0.5 - img_space_ratio / 2));
    $(".spin-container").width($(".photo img").width());
    $(".spin-container").height($(".photo img").height());
    
    $(".photo-count").width($(".photo img").width());
    $(".photo-count").css("bottom", gallery_height * (0.5 - img_space_ratio / 2) - 30);
  } else {
    //80% width
    //$(".photo").height(gallery_width * 0.8 / photo_ratio);
    $(".photo").width(gallery_width * img_space_ratio);
    
    $(".photo img").height(gallery_width * img_space_ratio / photo_ratio);
    $(".photo img").width(gallery_width * img_space_ratio);
    $(".photo img").css("margin-top", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2);
    
    $(".spin-container").css("top", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2);
    $(".spin-container").width($(".photo img").width());
    $(".spin-container").height($(".photo img").height());

    $(".photo-count").width($(".photo img").width());
    $(".photo-count").css("bottom", (gallery_height - gallery_width * img_space_ratio / photo_ratio) / 2 - 30);
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
      spin_start();
    },
    success: function (res) {
      if (res.result === "success") {
        $("<img/>").attr("src", res.data.url).load(function () {
          photo_ratio = this.width / this.height;
          setSize();
          spin_stop();
          $(".photo img").attr("src", res.data.url);
          $("span.photo-sort").text(current_sort);
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
    complete: function () {
      is_img_loading = 0;
    },
  });
};

var spin_start = function () {
  var opt = {
    lines: 9, // The number of lines to draw
    length: 8, // The length of each line
    width: 4, // The line thickness
    radius: 5, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1.2, // Rounds per second
    trail: 75, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
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

//mobile swipe
$(document).on("swipeleft", ".gallery", function () {
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

$(document).on("swiperight", ".gallery", function () {
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
