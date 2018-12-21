var SlideShow = {
  isOut: false,
  run: function() {
    console.log($(this).parent().children().last())
    isOut = false;
    var slidesNode = $(this).parent().children().last().find('img');
    var captionNode = $(this).parent().find(".caption");
    var titles = $(this).parent().find(".slides h3");
    var imageNode = $(this);
    console.log('imageNode', imageNode)
    var slides = slidesNode;
    var image,
      imageCounter = 0;
    var timer = setInterval(function() {
      if (!isOut) {
        imageCounter = (imageCounter + 1) % slides.length;
        image = slides[imageCounter];
        imageNode.attr("src", image.src);
        captionNode.text(titles[imageCounter].innerText);
      }
    }, 2000);
  },
  stop: function() {
    isOut = true;
  },
  setup: function() {
    $(".slide")
      .mouseenter(SlideShow.run)
      .mouseleave(SlideShow.stop);
  }
};
$(SlideShow.setup);
