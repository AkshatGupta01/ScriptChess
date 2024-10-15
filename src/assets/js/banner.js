$(document).ready(function() {
  // if($(".owl-stage-outer").length > 0) {
  //   let items = $(".banner-item").contents();
  //   $("#SliderSlide").append(items);
  //   $(".owl-stage-outer").remove();
  //   $(".owl-nav").remove();
  //   $(".owl-dots").remove();
  // }
  $('#SliderSlide').owlCarousel({
    loop: false,
    margin:5,
    autoplay:false,
    nav: false,
    dots: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      }
    }
  })

  })
