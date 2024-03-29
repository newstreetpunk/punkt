jQuery(function($) {

	var dataLayer = window.dataLayer || [];
	  
	function ymGoal(goalName,goalParams) {
	  try {
	    ym(60929896, 'reachGoal', goalName, goalParams||{});
	  } catch (err) {
	    console.error(goalName + ' - error send goal to Metrika');
	  }
	}
	function ymPage(pageName,goalParams) {
	  try {
	    ym(60929896, 'hit', pageName, goalParams||{});
	  } catch (err) {
	    console.error(goalName + ' - error send page to Metrika');
	  }
	}

	var $$$ = function(name) { return document.querySelector(name) },
		$$ = function(name) { return document.querySelectorAll(name) };

	var goals = [
		{
			selector: 'a[href^\="tel:"]',
			action: 'click',
			goal: 'phone-click',
			title: 'Клик по телефону',
		},
		{
			selector: 'a[href^\="tel:"]',
			action: 'copy',
			goal: 'phone-copy',
			title: 'Копирование телефона',
		},
		{
			selector: 'a[href^\="tel:"]',
			action: 'contextmenu',
			goal: 'phone-contextmenu',
			title: 'Контекстное меню на телефоне',
		},
		{
			selector: 'a[href^\="mailto:"]',
			action: 'click',
			goal: 'email-click',
			title: 'Клик по Email',
		},
		{
			selector: 'a[href^\="mailto:"]',
			action: 'copy',
			goal: 'email-copy',
			title: 'Копирование Email',
		},
		{
			selector: 'a[href^\="mailto:"]',
			action: 'contextmenu',
			goal: 'email-contextmenu',
			title: 'Контекстное меню на Email',
		},

		{
			selector: '.modal-link',
			action: 'click',
			goal: 'form-open',
			title: 'Открыли любую форму',
		},
		{
			selector: 'form',
			action: 'submit',
			goal: 'form-submit',
			title: 'Отправили любую форму',
		},

		{
			selector: '.video-link, .banner-video',
			action: 'click',
			goal: 'video-click',
			title: 'Смотреть видео',
		},
		
	];

	goals.forEach(function(value, index, array){
		if(value.goal != null) {
			$$(value.selector).forEach(function(element) {
				element.addEventListener(value.action, function(evt) {
					evt.preventDefault();
					ymGoal(value.goal);
				});
			});
		} else if(value.hit != null) {
			$$(value.selector).forEach(function(element) {
				element.addEventListener(value.action, function(evt) {
					evt.preventDefault();
					dataLayer.push({
						event:"pageView",
						eventAction: value.hit,
						title: value.title,
					});
				});
			});
		} else {

		}
	});

	window.addEventListener('onBitrixLiveChat', function(event)
	{
		var widget = event.detail.widget;

		// Обработка событий 
		widget.subscribe({
			type: BX.LiveChatWidget.SubscriptionType.userMessage,
			callback: function(data) {
				ymGoal('chat_send');
				
				if (typeof(dataLayer) == 'undefined')
				{
				  dataLayer = [];
				}
				dataLayer.push({
					"ecommerce": {
						"purchase": {
							"actionField": {
								"id" : "chat_send",
								"goal_id" : "60929896"
							},
							"products": [ {} ]
						}
					}
				});
			}
		});
		widget.subscribe({
			type: BX.LiveChatWidget.SubscriptionType.widgetOpen,
			callback: function(data) {
				ymGoal('chat_open');
				
				if (typeof(dataLayer) == 'undefined')
				{
				  dataLayer = [];
				}
				dataLayer.push({
					"ecommerce": {
						"purchase": {
							"actionField": {
								"id" : "chat_open",
								"goal_id" : "60929896"
							},
							"products": [ {} ]
						}
					}
				});
			}
		});
	});

	//E-mail Ajax Send
	$("form").submit(function() { //Change

		var th = $(this);
		var btnSubmit = th.find('button[type="submit"]');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "//alexsab.ru/lead/punkt-prava/", //Change
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

	$('.video-link, .banner-video').magnificPopup({
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
		$('.header__menu li.active').toggleClass('active');
		var anchor = $(this);
		anchor.parent().toggleClass('active');
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top}, 1000);
		e.preventDefault();
	});

	$('.header__menu li').click(function(){
		if ($('.header__menu').is(':visible')) {
			$('.header__menu').removeClass('open');
			$('.mobile-btn').removeClass('active');
		}
	});	

	$('.faq__question').click(function(){
		if ($(this).hasClass('active')) {
			$(this).removeClass('active').next().slideUp();
		}else{
			$(this).addClass('active').next().slideDown();
		}
		
	});

	/* загружать название видео только когда долистал до видео */
	var target = $('.faq__video');
	var getTitle = false;
	var targetPos = target.offset().top;
	var winHeight = $(window).height();
	var scrollToElem = targetPos - winHeight;
	$(window).scroll(function(){
		var winScrollTop = $(this).scrollTop();
		if(winScrollTop > scrollToElem && !getTitle){
			//сработает когда пользователь доскроллит к элементу с классом .faq__video
			getTitle = true;

	$('.faq__video--item').each(function(){
		let th  = $(this),
			vid = th.attr('href').split('='),
			api = 'AIzaSyB31S0lxesDwkuSGrAM4E4G2lyPgoNFQJA';

		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/videos?id="+vid+"&key="+api+"&fields=items(snippet(title))&part=snippet", 
			dataType: "jsonp",
			success: function(data){
				th.removeClass('faq__video--notitle');
				if (!data.error) {
					let title = data.items[0].snippet.title;
					th.find('span').text(title);
				}else{
					th.find('span').text('');
				}
			}
		});

	});

		}
	});
	/* загружать название видео только когда долистал до видео конец */

	let mountainWidth = $('.mountain').width();
	let rightTo = winWidth - mountainWidth + 90;

	function customMagic(){
		var controller = new ScrollMagic.Controller({
			globalSceneOptions: {
				triggerElement: ".stages__block",
				triggerHook: 'onLeave',
				offset: '-137',
				duration: '100%'
			}});
		var wipeAnimation = new TimelineMax()
			.to(".mountain", 1, {x: rightTo, ease: Linear.easeNone})  // in from right
			.fromTo(".stages-btn", 0.5, {x:'10%', y: "30%"}, {x:'10%', y: "-150%", ease: Linear.easeNone},'-=.8')  // in to top
			.fromTo(".stages__present", 1, {x: "-5%", y: "150%"}, {x: "-5%", y: "-20%", ease: Linear.easeNone},'-=.7', '0'); // in from bottom

		new ScrollMagic.Scene()
			.setPin(".stages__block")
			.setTween(wipeAnimation)
			// .addIndicators() // add indicators (requires plugin)
			.addTo(controller);
	}

	if ($(window).width() < 992) {
		customMagic();
	}

	$('.lazyload').lazyload();

});
