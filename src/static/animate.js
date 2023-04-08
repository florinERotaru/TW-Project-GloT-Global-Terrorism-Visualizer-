$(document).ready(function() {
            $('.scrollable').click(function() {
              var id = $(this).attr('id');
              $('html, body').animate({
                scrollTop: ($('#' + id + '.section').offset().top)
              }, 500);
            });})