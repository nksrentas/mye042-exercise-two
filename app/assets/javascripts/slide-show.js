$(function() {
  var isOut = false;
  $("#slide")
    .mouseenter(function() {
      isOut = false;
      var slidesNode = $("#slides img");
      var captionNode = $("#caption");
      var imageNode = $("#slide");
      var slides = slidesNode;
      var image,
        imageCounter = 0;
      var timer = setInterval(function() {
        if (!isOut) {
          imageCounter = (imageCounter + 1) % slides.length;
          image = slides[imageCounter];
          imageNode.attr("src", image.src);
          captionNode.text(image.alt);
        }
      }, 2000);
    })
    .mouseleave(function() {
      isOut = true;
    });
});