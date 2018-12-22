var SlideShow = {
  isOut: false,
  cancelPress: false,
  runSlide: function() {
    SlideShow.isOut = false;
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
    var timer = setInterval(function() {
      if (!SlideShow.isOut && !SlideShow.cancelPress) {
        imageCounter = (imageCounter + 1) % slides.length;
        image = slides[imageCounter];
        imageNode.attr("src", image.src);
        //console.log(image.dataset.photoId, image.dataset.userId)

        imageNode.parent().data(image.dataset); // Allagi ton data attributes kathe fora pou allazi h eikona
        captionNode.text(titles[imageCounter].innerText);
      }
    }, 2000);
  },
  stopSlide: function() {
    SlideShow.isOut = true;
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
        SlideShow.cancelPress = true;
      },
      error: function(xhrObj, textStatus, exception) {
        alert("Error!");
      }
    });
    return false;
  },
  hideComment: function() {
    SlideShow.cancelPress = false;
    $("#commentModal").hide();
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
      .click(SlideShow.clickedSlide);

    $("#closeButton").click(SlideShow.hideComment);

    $("#commentForm").submit(SlideShow.submitComment);

    var popupDiv = $('<div id="commentModal"></div>');
    popupDiv.hide().appendTo($("body"));
  }
};
$(SlideShow.setup);
