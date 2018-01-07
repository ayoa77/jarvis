$(document).ready(function() {
  
    $( '.signin' ).click(function() {
      $( '.signup' ).removeClass('activeMode');
      $( '.signin' ).addClass('activeMode');
    });
    
    $( '.signup' ).click(function() {
      $( '.signin' ).removeClass('activeMode');
      $( '.signup' ).addClass('activeMode');
    });
    
  });
