//=../bower_components/jquery/dist/jquery.js
//=../bower_components/bootstrap/dist/js/bootstrap.js
//=../bower_components/clipboard/dist/clipboard.js
//=../bower_components/wow/dist/wow.js


$(function () {
	function portfBtn() {
		if ($('.portfolio-list').outerHeight(true) < $('.portfolio-list').prop('scrollHeight') - 10) {
			$('.portfolio-btn').show();
		} else {
			$('.portfolio-btn').hide();
		}	
	}
	portfBtn();
	
	$(window).on('load', function(){
		portfBtn();
	});
	$(window).resize(function(){
		portfBtn()
	});	
  $(window).scroll(function(){
  	var	top = $(this).scrollTop(),
				innerHeight = $(document).height();
				bannerHeight = $('.banner').height();		
		if(top >= (bannerHeight - 60)) {
			$('.page-scroll').addClass('down')
		} else {
			$('.page-scroll').removeClass('down')
		}
  });

  $('.portfolio-btn').click(function() {
		$('.portfolio-list').css({
			minHeight: '100%',
			height: 'auto'
		}, 2000);
  	$(this).hide();
  });

  $(".navbar").on("click","a", function (event) {
    event.preventDefault();
    var id  = $(this).attr('href'),
        top = $(id).offset().top;
    $('body,html').animate({scrollTop: top -55}, 1000);
    $('.navbar').removeClass('active');
  });


  $( '.page-scroll' ).click(function() {
  	var innerHeight = $('.banner').height();
  	if ($('.page-scroll').hasClass('down')) {
  		$('body,html').animate({scrollTop: 0}, 1000);
  	} else {
  		$('body,html').animate({scrollTop: innerHeight - 55}, 1000);
  	}
	});

  $('.nav-toggle').click(function(){
		$('.navbar').toggleClass('active')
	});


  clipBoarrd = new ClipboardJS('.social-link');

  wow = new WOW({
  	offset: 100,
  	resetAnimation: false
  }).init();
});  

$(window).on('load', function(){
	$('.preloader').fadeOut();

	$(window).scroll(function(){
		var elem = $('.navbar'),
				top = $(this).scrollTop();
		if (top >= 70) {
			elem.addClass('fixed')
		} 
		else {
			elem.removeClass('fixed');
		}
	});
});