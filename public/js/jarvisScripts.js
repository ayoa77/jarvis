// Ready Player One
$(document).ready(function() {

    initSlickSlider();
    autoFooter();
    // modalLoad('modal-user-edit');  // Modal Tester

    $('.modal-container').click(function(e) {
      if(e.target !== e.currentTarget) {  // prevents child from inheriting parent click handling
        return;
      } else {
        modalClose();
      }
    });

    // Modal Pop-up Click for employee container and team container
    // Must not engage modalLoad() when they click on social media icons
    $('.team-selector').click(function(e) {
        let socialClick = $(this).children('.social-selector')[0];
        let check = false;
        
        for (i=0; i<socialClick.children.length; i++) {
          if (e.target == socialClick.children[i]) {
            check = true;
          }
        };
      
        if (check == true) {
          return;
        } else {
          modalLoad(`modal-team.${this.classList[2]}`);
        };
    });

    // Language Selector
  $(".dropdown-menu li a").click(function(){

    $(".language-selector-button").text($(this).text());
    $(".language-selector-button").val($(this).text());

  });

 });


// Login Modal Selector
$(document).on('click', '.signin', function(e) {
    $( '.signup' ).removeClass('active');
    $( '.signin' ).addClass('active');

    $('.login-box').css('margin-top', '0px');
});

$(document).on('click', '.signup', function(e) {
  $( '.signin' ).removeClass('active');
  $( '.signup' ).addClass('active');

  $('.login-box').css('margin-top', '-250px');
});

$(document).on('click', '.login-forgot-pass', function(e) {
  $( '.signin' ).removeClass('active');
  $( '.signup' ).removeClass('active');

  $('.login-box').css('margin-top', '-500px');
});


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
          speed: 80
        }
      },
      {
        breakpoint: 1440,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '50px',
          slidesToShow: 5,
          speed: 80
        }
      },
      {
        breakpoint: 1080,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '120px',
          slidesToShow: 3,
          speed: 80
        }
      },
      {
        breakpoint: 780,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '30px',
          slidesToShow: 3,
          speed: 80
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '80px',
          slidesToShow: 1,
          speed: 80
        }
      },
      {
        breakpoint: 380,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 1,
          speed: 80
        }
      },
      {
        breakpoint: 325,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '35px',
          slidesToShow: 1,
          speed: 80
      }
    }
    ]
  });

}
