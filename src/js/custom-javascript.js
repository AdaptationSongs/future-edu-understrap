jQuery(document).ready(function($) {

// enable responsive image maps
$('img[usemap]').rwdImageMaps();

// collapse mobile menu when item is clicked
$('ul.dropdown-menu>li>a.dropdown-item').on('click', function(){
  $('.navbar-collapse').collapse('hide');
});

// Shrink top nav bar on scroll
$(window).scroll(function() {
  if ($(document).scrollTop() > 1) {
    $('#wrapper-navbar').addClass('fixed-top');
    $('#page').addClass('scrolled');
  } else {
    $('#wrapper-navbar').removeClass('fixed-top');
    $('#page').removeClass('scrolled');
  }
});

// Enable popovers
$('[data-toggle="popover"]').popover();

});
