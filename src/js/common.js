jQuery(function($) {

	//E-mail Ajax Send
	$("form").submit(function() { //Change

		Data = new Date();
		Year = Data.getFullYear();
		Month = Data.getMonth() + 1;
		Day = Data.getDate();
		Hour = Data.getHours();
		Min = Data.getMinutes();
		Sec = Data.getSeconds();

		if (Month < 10) {
			Month = '0'+Month;
		}else{
			Month = Month;
		}

		var th = $(this);
		var date = th.find('#date');
		date.val(Day +'.'+ Month +'.'+ Year +' '+ Hour +':'+ Min +':'+ Sec);
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
			setTimeout(function() {
				$.magnificPopup.close();
				if(data == 'OK'){
					th.trigger("reset");
					swal({
						title: "Спасибо!",
						text: "Ваше сообщение успешно отправлено. В скором времени мы с Вами свяжемся.",
						icon: "success",
						button: false,
						timer: 3000
					});
				}else{
					swal({
						title: "Ошибка :(",
						text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова.",
						icon: "error",
						button: false,
						timer: 3000
					});
				}
				btnSubmit.removeAttr("disabled");
			}, 1000);
		}).fail(function() {
			setTimeout(function() {
				$.magnificPopup.close();
				swal({
					title: "Ошибка :(",
					text: "Что-то пошло не так. Перезагрузите страницу и попробуйте снова.",
					icon: "error",
					button: false,
					timer: 3000
				});
				btnSubmit.removeAttr("disabled");
			}, 1000);
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

	function myHeight() {
		let elem = $('.price__item');
		let tallest = 0;

		elem.each(function(i){
			let h = $(this).height();

			if (i != 1) {
				if (h > tallest) {
					tallest = h;
				}
				$(this).height(tallest);	
			}	

		});
	}
	//myHeight();

	function customResize(){
		winWidth    = $(window).width();
		container   = $('.callback .container').width();
		result      = (winWidth - container) / 2 + 15;
		contactElem = $('.contacts__info');

		contactElem.css('padding-left', result);

		if (winWidth < 768) {
			$('.price__item h3').click(function(){
				$(this).next().slideToggle();
			});
		}

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

		fixedContentPos: true
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

});
