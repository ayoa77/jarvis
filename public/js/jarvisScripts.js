// Ready Player One
$(document).ready(function() {

    initSlickSlider();
    autoFooter();
    modalLoad("meh");

    $('.modal-container').on('click', function() {
      modalClose();
    });

 });

 // Modal Loader
function modalLoad(content) {
  
  $('.modal-container').load('/ #hi-mom');

  $( '.modal-container' ).css({
    top: 0,
    height: "100vh",
    width: "100vw",
  });

  setTimeout(function() {
    $('.modal-container').css('background', 'rgba(0, 0, 0, .2)');
    $('.modal-container').focus();
  }, 50);
  
}

function modalClose() {
    
    $('.modal-container').empty();
    
    $('.modal-container').css({
      background: "rgba(0, 0, 0, 0)",
    });
    
    setTimeout(function() {
      $('.modal-container').css({
        top: "-50px",
        height: "50px",
        width: "50px",
      });
    }, 200);
}


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
    if ($('body').height() < $(window).height()) {
        let h = $(window).height() - ($('.navbar').height() + $('#user-selector').height() + $('#footer').height() + 38);
        $('#footer').css('margin-top', h);
    };
}


// Initialize the Slick Slider on the Index Page
 function initSlickSlider() {

  $('.center').slick({
    centerMode: true,
    slidesToShow: 7,
    responsive: [
      {
        breakpoint: 1920,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '50px',
          slidesToShow: 5 ,
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

 
