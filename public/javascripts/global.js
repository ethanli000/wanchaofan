/* global variables */
var is_mobile_menu_on = 0;

$(document).on("tap", ".mobile-menu", function (event) {
  event.stopImmediatePropagation();
  $(".grand-container").addClass("on");
  $(".side-container").after('<div class="main-cover"></div>');
});

$(document).on("tap", ".on .main-cover", function (event) {
  event.stopImmediatePropagation();
  $(".grand-container").removeClass("on");
  $(".main-cover").remove();
});