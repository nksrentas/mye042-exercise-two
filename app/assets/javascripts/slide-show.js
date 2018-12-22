var timer;
var isOut = false;
var cancelPress = false;
var SlideShow = {
  clickTimer: 0,
  clickDelay: 200,
  clickPrevent: false,
  runSlide: function() {
    if (cancelPress) {
      return; // eimai mesa sto modal ara den sinexizo to slide show
    }
    isOut = false;
    var slidesNode = $(this)
      .parent()
      .children()
      .last()
      .find("img");
    var captionNode = $(this)
      .parent()
      .find(".caption");
    var titles = $(this)
      .parent()
      .find(".slides h3");
    var imageNode = $(this).find("img");
    var slides = slidesNode;
    var image,
      imageCounter = 0;
    timer = setInterval(function() {
      //console.log('Check',isOut,cancelPress)
      if (!isOut && !cancelPress) {
        imageCounter = (imageCounter + 1) % slides.length;
        image = slides[imageCounter];
        imageNode.attr("src", image.src);
        imageNode.parent().data(image.dataset); // Allagi ton data attributes kathe fora pou allazi h eikona
        captionNode.text(titles[imageCounter].innerText);
      }
    }, 2000);
  },
  stopSlide: function() {
    if (timer !== false) {
      clearInterval(timer);
      isOut = true;
      //console.log('stopSlide',isOut,cancelPress)
    }
  },
  clickedSlide: function(node) {
    var userID = node.data("userid");
    var photosID = node.data("photoid");
    var oneFourth = Math.ceil($(window).width() / 4);
    if (timer !== false) {
      clearInterval(timer);
      cancelPress = true;
    }
    console.log("Click => ", isOut, cancelPress);
    $.ajax({
      type: "GET",
      url: `/users/${userID}/photos/${photosID}/comments/new`,
      timeout: 5000,
      success: function(data, requestStatus, xhrObject) {
        $("#commentModal")
          .css({
            left: oneFourth,
            width: 2 * oneFourth,
            top: 100,
            position: "fixed",
            "background-color": "bisque",
            height: 450,
            overflow: "scroll"
          })
          .html(data)
          .show();
cancelPress = true;
        console.log('Click',isOut,cancelPress)
      },
      error: function(xhrObj, textStatus, exception) {
        alert("Error!");
      }
    });
    return false;
  },
  doubleClicked: function(node) {
    var userID = node.data("userid");
    var photosID = node.data("photoid");
    $.ajax({
      url: `/users/${userID}/photos/${photosID}`,
      type: "DELETE",
      success: function(result) {
        console.log("Image deleted!");
      },
      error: function(xhrObj, textStatus, exception) {
        alert("Error!");
      }
    });
  },
  hideComment: function() {
    if (timer !== false) {
      clearInterval(timer);
      cancelPress = false;
      $("#commentModal").hide();
      //console.log(isOut,cancelPress)
    }
    return false;
  },
  submitComment: function(event) {
    event.preventDefault();
    if (timer !== false) {
      clearInterval(timer);
      cancelPress = false;
      console.log("Click ===>", isOut, cancelPress);
    }
    $.ajax({
      type: "POST",
      url: $(this).attr("action"),
      data: $(this).serialize(),
      dataType: "JSON"
    });
    $("#commentModal").hide();
  },
  setup: function() {
    $(".slide")
      .mouseenter(SlideShow.runSlide)
      .mouseleave(SlideShow.stopSlide)
      .on("click", function(e) {
        e.preventDefault();
        let node = $(this);
        SlideShow.clickTimer = setTimeout(function() {
          if (!SlideShow.clickPrevent) {
            SlideShow.clickedSlide(node);
          }
          SlideShow.clickPrevent = false;
        }, SlideShow.clickDelay);
      })
      .on("dblclick", function(e) {
        let node = $(this);
        clearTimeout(SlideShow.clickTimer);
        SlideShow.clickPrevent = true;
        SlideShow.doubleClicked(node);
      });

    $("#closeButton").click(SlideShow.hideComment);

    $("#commentForm").submit(SlideShow.submitComment);

    var popupDiv = $('<div id="commentModal"></div>');
    popupDiv.hide().appendTo($("body"));
  }
};
$(SlideShow.setup);
