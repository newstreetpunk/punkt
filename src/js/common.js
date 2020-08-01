jQuery(function($) {
	
	$('.mobile-btn').on('click', function() {
		$(this).toggleClass('active');
		$('.header__menu').toggleClass('open');
	});

	elem = $('.header');

	$(window).scroll(function(){

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

	if ($(window).scrollTop() != 0) {
		$('.header__phone, .header__phone a').css('color', '#000000');
		elem.css({
			'background-color': '#ffffff',
			'box-shadow': '0 10px 50px rgba(0,0,0,.5)',
			'padding': '20px 0'
		});
	}

	function customResize(){
		winWidth    = $(window).width();
		container   = $('.callback .container').width();
		result      = (winWidth - container) / 2 + 15;
		contactElem = $('.contacts__info');

		contactElem.css('padding-left', result);
	}customResize();

	$(window).resize(function(){
		customResize();
	});

	$('.lazyload').lazyload();

	// MODALS
	$('.modal-link').click(function(){
		let th    = $(this),
			id    = th.attr('href'),
			str   = id.replace('#', ''),
			title = th.data('title');
		$(id+ ' form').find('h3').text(title);


		$.magnificPopup.open({
			items: {
				src: id,
				type: 'inline',
				fixedContentPos: true,
				modal: true,
				preloader: false
			}
		});

		return false;
	});

	$('.video-link').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,

		fixedContentPos: false
	});

});
