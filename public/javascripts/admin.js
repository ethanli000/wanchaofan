var global_editing = 0;
var global_current_editing_title = "";
var closeEdit = function () {
  global_editing = 0;
  global_current_editing_title = "";
  $('.edit-series').remove();
  $('.is-edit').removeClass("is-edit").show();
};

$(document).ready(function () {
});

$(document).on("click", this, function () {
  $(".error-message").text("");
});

$(document).on("click", "#add-series", function () {
  var name = $("#new-series-name").val();
  $(".error-message").text("");
  if (!name || name === "") {
    $(".error-message").text("please fill a series name before add.");
    return false;
  }
  $.ajax({
    async: true,
    method: "POST",
    dataType: "json",
    url: "/admin/series/add",
    data: {name: name},
    beforeSend: function () {
      $("#add-series").attr("disabled", "disabled").addClass("disabled");
    },
    success: function (res) {
      if (res.result === "success") {
        var new_series = '<div class="series clearfix"><input type="hidden" value="';
        new_series += res.data.series_key + '" name="key"><span class="name">';
        new_series += res.data.name + '</span><input type="button" name="hide" value="HIDE" class="series-botton"><input type="button" name="delete" value="DELETE" class="series-botton"></div>';
        $(".new-series").before(new_series);
        $("#new-series-name").val("");
      } else {
        $(".error-message").text("ADD FAILED: " + res.message);
      }
    },
    error: function () {
      $(".error-message").text("ADD FAILED: server error!");
    },
    complete: function () {
      $("#add-series").removeAttr("disabled").removeClass("disabled");
    },
  });
});

$(document).on("click", 'span.name', function () {
  if (global_editing) {
    //closeEdit();
    $("#edit-series-name").focus();
    return false;
  }
  global_editing = 1;
  global_current_editing_title = $(this).text();
  var series_key = $(this).parents('.series').children('input[name="key"]').val();
  var editing_feild = '<div class="edit-series clearfix"><input type="hidden" name="key" value="';
  editing_feild += series_key + '"><input id="edit-series-name" type="text" name="edit-name" value="';
  editing_feild += global_current_editing_title + '"><input type="button" name="save" value="SAVE" class="series-botton"><input type="button" name="cancel" value="X" class="series-botton"></div>';
  $(this).parents('.series').after(editing_feild);
  $(this).parents('.series').addClass("is-edit").hide();
  $('#edit-series-name').focus().val($('#edit-series-name').val());
});

$(document).on("click", '#new-series-name', function () {
  closeEdit();
});


$(document).on("click", 'input[name="delete"]', function () {
  var series_key = $(this).parents('.series').children('input[name="key"]').val();
  $.ajax({
    async: true,
    context: this,
    method: "POST",
    dataType: "json",
    url: "/admin/series/delete",
    data: {series_key: series_key},
    beforeSend: function () {
      $(this).attr("disabled", "disabled").addClass("disabled");
    },
    success: function (res) {
      if (res.result === "success") {
        $(this).parents('.series').remove();
      } else {
        $(".error-message").text("DELETE FAILED: " + res.message);
      }
    },
    error: function () {
      $(".error-message").text("DELETE FAILED: server error!");
    },
    complete: function () {
      $(this).removeAttr("disabled").removeClass("disabled");
    }
  });
});

$(document).on("click", 'input[name="hide"]', function () {
  var series_key = $(this).parents('.series').children('input[name="key"]').val();
  $.ajax({
    async: true,
    context: this,
    method: "POST",
    dataType: "json",
    url: "/admin/series/edit",
    data: {series_key: series_key, update_data: JSON.stringify({is_show: 0}) },
    beforeSend: function () {
      $(this).attr("disabled", "disabled").addClass("disabled");
    },
    success: function (res) {
      if (res.result === "success") {
        $(this).attr("name", "show").val("SHOW");
      } else {
        $(".error-message").text("HIDE FAILED: " + res.message);
      }
    },
    error: function () {
      $(".error-message").text("HIDE FAILED: server error!");
    },
    complete: function () {
      $(this).removeAttr("disabled").removeClass("disabled");
    }
  });
});

$(document).on("click", 'input[name="show"]', function () {
  var series_key = $(this).parents('.series').children('input[name="key"]').val();
  $.ajax({
    async: true,
    context: this,
    method: "POST",
    dataType: "json",
    url: "/admin/series/edit",
    data: {series_key: series_key, update_data: JSON.stringify({is_show: 1}) },
    beforeSend: function () {
      $(this).attr("disabled", "disabled").addClass("disabled");
    },
    success: function (res) {
      if (res.result === "success") {
        $(this).attr("name", "hide").val("HIDE");
      } else {
        $(".error-message").text("SHOW FAILED: " + res.message);
      }
    },
    error: function () {
      $(".error-message").text("SHOW FAILED: server error!");
      $(this).removeAttr("disabled").removeClass("disabled");
    },
    complete: function () {
      $(this).removeAttr("disabled").removeClass("disabled");
    }
  });
});

$(document).on("click", 'input[name="save"]', function () {
  var series_key = $(this).parents('.edit-series').children('input[name="key"]').val();
  var name = $(this).parents('.edit-series').children('#edit-series-name').val();
  name = $.trim(name);
  if (name === "") {
    $(".error-message").text("please fill a name before save.");
    $('#edit-series-name').focus().val($('#edit-series-name').val());
    return false;
  }
  if (name === global_current_editing_title) {
    closeEdit();
    return false;
  }
  $.ajax({
    async: true,
    context: this,
    method: "POST",
    dataType: "json",
    url: "/admin/series/edit",
    data: {series_key: series_key, update_data: JSON.stringify({name: name}) },
    beforeSend: function () {
      $(this).attr("disabled", "disabled").addClass("disabled");
    },
    success: function (res) {
      if (res.result === "success") {
        $('.is-edit').children("span.name").text(name);
      } else {
        $(".error-message").text("EDIT FAILED: " + res.message);
      }
    },
    error: function () {
      $(".error-message").text("EDIT FAILED: server error!");
    },
    complete: function () {
      closeEdit();
    },
  });
});

$(document).on("click", 'input[name="cancel"]', function () {
  closeEdit();
});


