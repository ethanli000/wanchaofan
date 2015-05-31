/* global variables */
var is_mobile_menu_on = 0;

$(document).on("tap", ".mobile-menu", function (event) {
  event.stopImmediatePropagation();
  is_mobile_menu_on = 1;
  $(".grand-container").addClass("on");
});

$(document).on("tap", ".on .main-container", function (event) {
  event.stopImmediatePropagation();
  is_mobile_menu_on = 0;
  $(".grand-container").removeClass("on");
});