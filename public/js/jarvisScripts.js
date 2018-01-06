$(document).ready(function() {
  
    $( '.signin' ).click(function() {
      $( '.signup' ).removeClass('active');
      $( '.signin' ).addClass('active');
    });
    
    $( '.signup' ).click(function() {
      $( '.signin' ).removeClass('active');
      $( '.signup' ).addClass('active');
    });
    
  });
