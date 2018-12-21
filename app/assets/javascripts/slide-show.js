var SlideShow = {
  isOut: false,
  runSlide: function() {
    isOut = false;
    var slidesNode = $(this).parent().children().last().find('img');
    var captionNode = $(this).parent().find(".caption");
    var titles = $(this).parent().find(".slides h3");
    var imageNode = $(this).find("img");
    var slides = slidesNode;
    var image,
      imageCounter = 0;
    var timer = setInterval(function() {
      if (!isOut) {
        imageCounter = (imageCounter + 1) % slides.length;
        image = slides[imageCounter];
        imageNode.attr("src", image.src);
        //console.log(image.dataset.photoId, image.dataset.userId)

        imageNode.parent().data(image.dataset)        // Allagi ton data attribute kathe fora pou allazi h eikona
        captionNode.text(titles[imageCounter].innerText);
      }
    }, 2000);
  },
  stopSlide: function() {
    isOut = true;
  },
  clickedSlide: function() {
    var userID = $(this).data('userid')
    var photosID = $(this).data('photoid')
    var oneFourth = Math.ceil($(window).width() / 4);
    $.ajax({type: 'GET',
            url: `/users/${userID}/photos/${photosID}/comments/new`,
            timeout: 5000,
            success: function(data, requestStatus, xhrObject) {
              $('#commentModal').
              css({'left': oneFourth,  'width': 2*oneFourth, 'top': 100, "position": 'fixed', "background-color": 'bisque'}).
              html(data).
              show();
            },
            error: function(xhrObj, textStatus, exception) { alert('Error!'); }
            
           });
    return(false);
  },
  hideComment: function() {
    $('#commentModal').hide();
    return(false);
  },
  setup: function() {
    $(".slide")
      .mouseenter(SlideShow.runSlide)
      .mouseleave(SlideShow.stopSlide)
      .click(SlideShow.clickedSlide);
      $('#closeButton').click(SlideShow.hideComment);
    var popupDiv = $('<div id="commentModal"></div>');
    popupDiv.hide().appendTo($('body'));
  }
};
$(SlideShow.setup);
