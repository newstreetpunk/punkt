jQuery(function($) {
	
	$('.mobile-btn').on('click', function() {
		$(this).toggleClass('active');
		$('.header__menu').toggleClass('open');
	});

	$(window).scroll(function(){
		elem = $('.header');

		if ($(this).scrollTop() != 0) {
			$('.header__phone, .header__phone a').css('color', '#000000');
			elem.css({
				'background-color': '#ffffff',
				'box-shadow': '0 10px 50px rgba(0,0,0,.5)',
				'padding': '20px 0'
			});
		} else {
			$('.header__phone, .header__phone a').removeAttr('style');
			elem.removeAttr('style');
		}
	});

});
