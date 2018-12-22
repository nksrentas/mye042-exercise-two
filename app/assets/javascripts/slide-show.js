var timer;
var SlideShow = {
  clickTimer: 0,
  clickDelay: 200,
  clickPrevent: false,
  isOut: false,
  cancelPress: false,
  runSlide: function() {
    if (SlideShow.cancelPress) {
      return // eimai mesa sto modal ara den sinexizo to slide show
    }
    SlideShow.isOut = false
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
      //console.log('Check',SlideShow.isOut,SlideShow.cancelPress)
      if (!SlideShow.isOut && !SlideShow.cancelPress) {
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
      SlideShow.isOut = true;
      //console.log('stopSlide',SlideShow.isOut,SlideShow.cancelPress)
    }
  },
  clickedSlide: function() {
    var userID = $(this).data("userid");
    var photosID = $(this).data("photoid");
    var oneFourth = Math.ceil($(window).width() / 4);
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

        clearInterval(timer);
        SlideShow.isOut = true;
        SlideShow.cancelPress = true;
        //console.log('Click',SlideShow.isOut,SlideShow.cancelPress)
          
      },
      error: function(xhrObj, textStatus, exception) {
        alert("Error!");
      }
    });
    return false;
  },
  doubleClicked: function(e) {
    var userID = e.target.parentNode.dataset.userid;
    var photosID = e.target.parentNode.dataset.photoid;
    //console.log(userID, photosID);
  },
  hideComment: function() {
    if (timer !== false) {
      clearInterval(timer);
      SlideShow.cancelPress = false;
      $("#commentModal").hide();    
      //console.log(SlideShow.isOut,SlideShow.cancelPress)
    }
    return false;
  },
  submitComment: function(event) {
    event.preventDefault();
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
        SlideShow.clickTimer = setTimeout(function() {
          if (!SlideShow.clickPrevent) {
            SlideShow.clickedSlide();
          }
          SlideShow.clickPrevent = false;
        }, SlideShow.clickDelay);
      })
      .on("dblclick", function(e) {
        clearTimeout(SlideShow.clickTimer);
        SlideShow.clickPrevent = true;
        SlideShow.doubleClicked(e);
      });

    $("#closeButton").click(SlideShow.hideComment);

    $("#commentForm").submit(SlideShow.submitComment);

    var popupDiv = $('<div id="commentModal"></div>');
    popupDiv.hide().appendTo($("body"));
  }
};
$(SlideShow.setup);
