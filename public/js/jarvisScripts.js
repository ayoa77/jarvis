$(document).ready(function() {
    initSlickSlider();
    autoFooter();

  
    $( '.signin' ).click(function() {
      $( '.signup' ).removeClass('activeMode');
      $( '.signin' ).addClass('activeMode');
    });
    
    $( '.signup' ).click(function() {
      $( '.signin' ).removeClass('activeMode');
      $( '.signup' ).addClass('activeMode');
    });
 });


 // Check if User is a Keyboard Navigator to add/remove Chrome's default Focus
function handleFirstTab(e) {
  if (e.keyCode === 9) { // the "I am a keyboard user" key
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
  }
}

window.addEventListener('keydown', handleFirstTab);


// Keep the footer on the bottom of the User Page
function autoFooter() {
    console.log(`${$('body').height()} is the body, and ${$(window).height()} is the window.`);
    if ($('body').height() < $(window).height()) {
        console.log('hi dad');
        let h = $(window).height() - ($('.navbar').height() + $('#user-selector').height() + $('#footer').height() + 38);
        $('#footer').css('margin-top', h);
    };
}


// Initialize the Slick Slider on the Index Page
 function initSlickSlider() {

  $('.center').slick({
    centerMode: true,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '50px',
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
          centerPadding: '35px',
          slidesToShow: 1,
          speed: 100
      }
    }
    ]
  });

}

 
