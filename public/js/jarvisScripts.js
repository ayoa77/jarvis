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
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '150px',
          slidesToShow: 5,
          speed: 100
        }
      },
      {
        breakpoint: 1440,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '50px',
          slidesToShow: 5,
          speed: 100
        }
      },
      {
        breakpoint: 1080,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '120px',
          slidesToShow: 3,
          speed: 100
        }
      },
      {
        breakpoint: 780,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '30px',
          slidesToShow: 3,
          speed: 100
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '80px',
          slidesToShow: 1,
          speed: 100
        }
      },
      {
        breakpoint: 380,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 1,
          speed: 100
        }
      },
      {
        breakpoint: 325,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1,
          speed: 100
      }
    }
    ]
  });

}

 
