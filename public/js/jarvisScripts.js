$(document).ready(function() {
    initSlickSlider();
  
    $( '.signin' ).click(function() {
      $( '.signup' ).removeClass('activeMode');
      $( '.signin' ).addClass('activeMode');
    });
    
    $( '.signup' ).click(function() {
      $( '.signin' ).removeClass('activeMode');
      $( '.signup' ).addClass('activeMode');
    });
 });





 function initSlickSlider() {

    $('.center').slick({
      centerMode: true,
      centerPadding: '60px',
      slidesToShow: 3,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 1
          }
        },
        {
          breakpoint: 320,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '10px',
            slidesToShow: 1
          }
        }
      ]
    });

}

 
