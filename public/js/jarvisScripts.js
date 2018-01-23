// Ready Player One
$(document).ready(function() {

    initSlickSlider();
    autoFooter();

 });

$(document).on('click', '.signin', function(e) {
    $( '.signup' ).removeClass('active');
    $( '.signin' ).addClass('active');
});

$(document).on('click', '.signup', function(e) {
  $( '.signin' ).removeClass('active');
  $( '.signup' ).addClass('active');
})



 // Modal Loader
function modalLoad(content) {

  $(window).disablescroll();

  $('.modal-container').css('display', 'flex');

  $('.modal-box').velocity({
    height: 'auto',
    width: '100%',
    opacity: '1',
  }, {
    duration: '200',
  });

  $('.modal-box').load(`/ .${content}`);
}

function modalClose() {
    
  $('.modal-box').empty();

  $('.modal-box').velocity({
    height: '50px',
    width: '50px',
    opacity: '0',
  }, {
    duration: '200',
  });

  setTimeout(function() {
    $('.modal-container').css('display', 'none');
  }, 200);

  $(window).disablescroll('undo');


}


 // Listen to Tab and Escape Key Inputs
function handleKeyDown(e) {
  if (e.keyCode === 9) { // the "I am a keyboard user" key
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
  }

    if (e.keyCode === 27) { // escape key maps to keycode `27`
       modalClose();
   }
}

window.addEventListener('keydown', handleKeyDown);


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

 
