jQuery(function($) {

	//E-mail Ajax Send
	$("form").submit(function() { //Change

		var th = $(this);
		var btnSubmit = th.find('button[type="submit"]');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize() +'&referer=' + replUrl
		}).done(function( data ) {
			// console.log( "success data:", data );
			if(data != "")
			setTimeout(function() {
				$.magnificPopup.close();
				try {
					res = JSON.parse(data);
				} catch(e) {
					res = "";
				}
				if(res.answer == 'ok'){
					th.trigger("reset");
					swal({
						title: "Спасибо!",
						text: "Ваше сообщение успешно отправлено.\nВ скором времени мы с Вами свяжемся.",
						icon: "success",
						button: "Хорошо",
						// timer: 3000
					});
				}else{
					swal({
						title: "Ошибка :(",
						text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова. Или позвоните нам.",
						icon: "error",
						buttons: {
							cancel: "Хорошо",
							catch: {
								text: "Позвонить",
								value: "call",
							},
						},
					})
					.then((value) => {
						switch (value) {

							case "call":
								location.href = "tel:+79277499477";
								break;

							default:
						}
					});
				}
				btnSubmit.removeAttr("disabled");
			}, 100);
		}).fail(function() {
			setTimeout(function() {
				$.magnificPopup.close();
				swal({
					title: "Ошибка :(",
					text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова. Или позвоните нам.",
					icon: "error",
					buttons: {
						cancel: "Хорошо",
						catch: {
							text: "Позвонить",
							value: "call",
						},
					},
				})
				.then((value) => {
					switch (value) {

						case "call":
							location.href = "tel:+79277499477";
							break;

						default:
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 100);
		});
		return false;
	});

	
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

	function eqHeight(elem) {
		let tallest = 0;

		$(elem).each(function(){
			let h = $(this).height();

			if (h > tallest) {
				tallest = h;
			}
			$(elem).height(tallest);	

		});
	}
	

	function clickTitle(){
		$('.price__item h3').click(function(){
			if ($(window).width() < 768) {
				$(this).next().slideToggle(100);
				$(this).closest('.price__item').toggleClass('active');
			}
		});
	}

	clickTitle();

	function customResize(){
		winWidth    = $(window).width();
		container   = $('.callback .container').width();
		result      = (winWidth - container) / 2 + 15;
		contactElem = $('.contacts__info');

		contactElem.css('padding-left', result);
		$('.worksteps').css('padding-left', result);
		$('.cases__block').css('padding-right', result);

	}

	customResize();

	$(window).resize(function(){
		customResize();
		// clickTitle();
	});

	// MODALS
	$('.modal-link').click(function(){
		let th    = $(this),
			id    = th.attr('href'),
			str   = id.replace('#', ''),
			title = th.data('title');
		$(id+ ' form').find('h3').text(title);
		$(id+ ' form').find('.form-name').val(title);


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

		fixedContentPos: true
	});
	$('.cases__viewing a').magnificPopup({
		type: 'image'
	});

	$('a[href="#privacy-policy"]').on('click', function(){

		$('.overlay').show();
		$('.privacy-wrap').show();
		$('html').css({
			'margin-right': '17px',
			'overflow': 'hidden'
		});

		return false;
	});

	$('.overlay, .privacy-close').on('click', function(){
		$('.overlay').hide();
		$('.privacy-wrap').hide();
		if ($('#callback_form').is(':hidden')) {
			$('html').removeAttr('style');
		}
		
	});

	$('.cases__preview').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
		vertical: true,
		verticalSwiping: true,
		// centerMode: true,
		prevArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-prev"><img src="img/arrow-top.svg"></button>' : '<button class="slick-prev"><img src="img/arrow-top.svg"></button>',
		nextArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-next"><img src="img/arrow-down.svg"></button>' : '<button class="slick-next"><img src="img/arrow-down.svg"></button>',
		// prevArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-prev"><img src="/assets/templates/lp/img/arrow-top.svg"></button>' : '<button class="slick-prev"><img src="img/arrow-top.svg"></button>',
		// nextArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-next"><img src="/assets/templates/lp/img/arrow-down.svg"></button>' : '<button class="slick-next"><img src="img/arrow-down.svg"></button>',
		responsive: [
		{
			breakpoint: 1200,
			settings: {
				vertical: false,
				verticalSwiping: false,
			}
		},
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				vertical: false,
				verticalSwiping: false,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 3,
				vertical: false,
				verticalSwiping: false,
			}
		},
		{
			breakpoint: 576,
			settings: {
				slidesToShow: 1,
				vertical: false,
				verticalSwiping: false,
			}
		}
		]
	});

	$('.faq__video').slick({
		infinite: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		dots: false,
		arrows: true,
		vertical: true,
		verticalSwiping: true,
		// centerMode: true,
		prevArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-prev"><img src="img/arrow-top.svg"></button>' : '<button class="slick-prev"><img src="img/arrow-top.svg"></button>',
		nextArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-next"><img src="img/arrow-down.svg"></button>' : '<button class="slick-next"><img src="img/arrow-down.svg"></button>',
		// prevArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-prev"><img src="/assets/templates/lp/img/arrow-top.svg"></button>' : '<button class="slick-prev"><img src="img/arrow-top.svg"></button>',
		// nextArrow: location.host == "xn----8sbah1brndjri.xn--p1ai" ? '<button class="slick-next"><img src="/assets/templates/lp/img/arrow-down.svg"></button>' : '<button class="slick-next"><img src="img/arrow-down.svg"></button>',
		responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
				vertical: false,
				verticalSwiping: false,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				vertical: false,
				verticalSwiping: false,
			}
		}
		]
	});

	$('.cases__preview--item').click(function(){

		let th         = $(this),
			img        = th.css('background-image').split(/\//).slice(-3).join("/").slice(0, -2),
			writingoff = th.find('.writingoff strong').text(),
			debt       = th.find('.debt strong').text(),
			casenumber = th.find('.casenumber strong').text();
		
		$('.cases__viewing img').attr('src', img);
		$('.cases__viewing a').attr('href', img);
		$('.cases__viewing .writingoff strong').text(writingoff);
		$('.cases__viewing .debt strong').text(debt);
		$('.cases__viewing .casenumber strong').text(casenumber);

	});

	$('a.scroll').bind("click", function(e){
		$('.mobile-btn').click();
		$('.header__menu li.active').toggleClass('active');
		var anchor = $(this);
		anchor.parent().toggleClass('active');
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top}, 1000);
		e.preventDefault();
	});

	$('.faq__question').click(function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active').next().slideUp();
		}else{
			$(this).addClass('active').next().slideDown();
		}
		
	});

	$('.faq__video--item').each(function(){
		let th  = $(this),
			vid = th.attr('href').split('='),
			api = 'AIzaSyB31S0lxesDwkuSGrAM4E4G2lyPgoNFQJA';

		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/videos?id="+vid+"&key="+api+"&fields=items(snippet(title))&part=snippet", 
			dataType: "jsonp",
			success: function(data){
				try	{
					let title = data.items[0].snippet.title;
				} catch(e) {
					title = false;
				}
				if (title) {
					th.find('span').text(title);
				}else{
					th.find('span').text('');
				}
			}
		});

	});

	$('.lazyload').lazyload();

});
