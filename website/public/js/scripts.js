
$(document).ready(function() {
	
	var pathname = window.location.pathname;
	// var router = pathname.split("/");
	
	var router = pathname.split("/").filter(function (el) {
		return el != "";
	});
	

	switch (router[0]) {
		case "blog":
		case "projects":
			if (router[1] != "")
				post();
			break;
		default:
			home();
			break;
	}


	function home() {
		// home banner slide
		new Swiper ('#slider-container .swiper-container', {
			loop: true,	
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			speed: 800,
			autoplay: {
				delay: 4000,
			},
		})
		
	}

	function post() {
		new Swiper ('#post-slider .swiper-container', {
			loop: true,	
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
			speed: 800
		})
		
	}
});