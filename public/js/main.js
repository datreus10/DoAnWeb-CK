/* =================================
------------------------------------
	Divisima | eCommerce Template
	Version: 1.0
 ------------------------------------
 ====================================*/


'use strict';


$(window).on('load', function () {
	/*------------------
		Preloder
	--------------------*/
	$(".loader").fadeOut();
	$("#preloder").delay(400).fadeOut("slow");

});

(function ($) {
	/*------------------
		Navigation
	--------------------*/
	$('.main-menu').slicknav({
		prependTo: '.main-navbar .container',
		closedSymbol: '<i class="flaticon-right-arrow"></i>',
		openedSymbol: '<i class="flaticon-down-arrow"></i>'
	});


	/*------------------
		ScrollBar
	--------------------*/
	$(".cart-table-warp, .product-thumbs").niceScroll({
		cursorborder: "",
		cursorcolor: "#afafaf",
		boxzoom: false
	});


	/*------------------
		Category menu
	--------------------*/
	$('.category-menu > li').hover(function (e) {
		$(this).addClass('active');
		e.preventDefault();
	});
	$('.category-menu').mouseleave(function (e) {
		$('.category-menu li').removeClass('active');
		e.preventDefault();
	});


	/*------------------
		Background Set
	--------------------*/
	$('.set-bg').each(function () {
		var bg = $(this).data('setbg');
		$(this).css('background-image', 'url(' + bg + ')');
	});



	/*------------------
		Hero Slider
	--------------------*/
	var hero_s = $(".hero-slider");
	hero_s.owlCarousel({
		loop: true,
		margin: 0,
		nav: true,
		items: 1,
		dots: true,
		animateOut: 'fadeOut',
		animateIn: 'fadeIn',
		navText: ['<i class="flaticon-left-arrow-1"></i>', '<i class="flaticon-right-arrow-1"></i>'],
		smartSpeed: 1200,
		autoHeight: false,
		autoplay: true,
		onInitialized: function () {
			var a = this.items().length;
			$("#snh-1").html("<span>1</span><span>" + a + "</span>");
		}
	}).on("changed.owl.carousel", function (a) {
		var b = --a.item.index,
			a = a.item.count;
		$("#snh-1").html("<span> " + (1 > b ? b + a : b > a ? b - a : b) + "</span><span>" + a + "</span>");

	});

	hero_s.append('<div class="slider-nav-warp"><div class="slider-nav"></div></div>');
	$(".hero-slider .owl-nav, .hero-slider .owl-dots").appendTo('.slider-nav');



	/*------------------
		Brands Slider
	--------------------*/
	$('.product-slider').owlCarousel({
		loop: true,
		nav: true,
		dots: false,
		margin: 30,
		autoplay: true,
		navText: ['<i class="flaticon-left-arrow-1"></i>', '<i class="flaticon-right-arrow-1"></i>'],
		responsive: {
			0: {
				items: 1,
			},
			480: {
				items: 2,
			},
			768: {
				items: 3,
			},
			1200: {
				items: 4,
			}
		}
	});


	/*------------------
		Popular Services
	--------------------*/
	$('.popular-services-slider').owlCarousel({
		loop: true,
		dots: false,
		margin: 40,
		autoplay: true,
		nav: true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1,
			},
			768: {
				items: 2,
			},
			991: {
				items: 3
			}
		}
	});


	/*------------------
		Accordions
	--------------------*/
	$('.panel-link').on('click', function (e) {
		$('.panel-link').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
	});


	/*-------------------
		Range Slider
	--------------------- */
	var rangeSlider = $(".price-range"),
		minamount = $("#minamount"),
		maxamount = $("#maxamount"),
		minPrice = rangeSlider.data('min'),
		maxPrice = rangeSlider.data('max');
	rangeSlider.slider({
		range: true,
		min: minPrice,
		max: maxPrice,
		values: [minPrice, maxPrice],
		slide: function (event, ui) {
			minamount.val(ui.values[0]);
			maxamount.val(ui.values[1]);
		}
	});
	minamount.val(rangeSlider.slider("values", 0));
	maxamount.val(rangeSlider.slider("values", 1));


	/*-------------------
		Quantity change
	--------------------- */
	var proQty = $('.pro-qty');
	proQty.on('click', '.qtybtn', function () {
		var $button = $(this);
		var oldValue = $button.parent().find('input').val();

		var maxQuantity = $(this).closest('.quantity').find('.tab-pane.active span').text();

		if ($button.hasClass('inc')) {
			var newVal = (parseFloat(oldValue) + 1) > maxQuantity ? parseFloat(oldValue) : parseFloat(oldValue) + 1;

		} else {
			// Don't allow decrementing below zero
			if (oldValue > 1) {
				newVal = parseFloat(oldValue) - 1;
			} else {
				newVal = 1;
			}
		}
		$button.parent().find('input').val(newVal).trigger("change");
	});

	$('.pro-qty input[type=text]').change(function () {
		var price = $(this).closest('tr').find('.product-info span.price-base').text();
		$(this).closest('tr').find('.thanh_tien span').text(formatNumbertoPrice(extractNumberFromString(price)* $(this).val()));
		var checkbox = $(this).closest('tr').find('input[name="product-checkbox"]');
		if (checkbox.is(":checked")) {
			checkbox.trigger("change");
		}
	})

	/*-------------------
			Size change
		--------------------- */
	$('input[name="size"]').click(function () {
		$(this).tab('show');
		$(this).removeClass('active');
		$('.pro-qty input[type=text]').val("1");
	}); // trang product

	$('select[name="size"]').on('change', function (e) {
		var $optionSelected = $("option:selected", this);
		$optionSelected.tab('show')
		$optionSelected.removeClass('active');
		$(this).closest('tr').find('.pro-qty input[type=text]').val("1").trigger('change');
	});


	function extractNumberFromString(str) {
		return parseInt(str.replace(/[^0-9]/g,''));
	}

	function formatNumbertoPrice(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
	}

	$(document).on('click', '#checkout', function (event) {
		event.preventDefault();
		var data = $('tr').map(function () {
			var obj = {};
			var isEmpty = true;
			$(this).find('input, select').each(function () {
				if (!$(this).is(':checked') && $(this).is(':checkbox')) {
					return false;
				}
				obj[this.name] = $(this).val();
				isEmpty = false;
			});
			if (!isEmpty) return obj;
		}).get();

		if (data.length > 0) {
			$.post('/checkout', {
				"data": JSON.stringify(data)
			}, function (data, status) {
				if (data.result == "redirect") {
					window.location.replace(data.url);
				}
			})
		} else {
			$('#nofication-modal .modal-body').text("Bạn chưa chọn sản phẩm để mua");
			$('#nofication-modal').modal('show');
		}

	});

	$('input[name="product-checkbox"]').change(function () {
		var total = 0;
		$('input[name="product-checkbox"]').each(function () {
			if ($(this).is(":checked")) {
				total += extractNumberFromString($(this).closest('tr').find('.thanh_tien span').text())
			}
		})
		$('#total-price').text(formatNumbertoPrice(total))
	});


	$('#select-all').click(function () {
		if (this.checked) {
			$('input[name="product-checkbox"]').prop('checked', true).trigger("change");
		} else {
			$('input[name="product-checkbox"]').prop('checked', false).trigger("change");
		}
	})

	$('#delete-all-btn').click(function () {
		var items = []
		$('input[name="product-checkbox"]').each(function () {
			if (this.checked) {
				items.push({
					product: $(this).val()
				})
			}
		})
		if (items.length > 0) {
			$('#delete-confirm .modal-body').text("Bạn muốn xóa sản phẩm đang chọn");
			$('#delete-confirm').modal('show');
			$('#delete-confirm-btn').data('id', items);
		} else {
			$('#nofication-modal .modal-body').text("Bạn chưa chọn sản phẩm để xóa");
			$('#nofication-modal').modal('show');
		}
	})

	$('.btn-del-product').click(function () {
		var ID = $(this).data('id');
		$('#delete-confirm-btn').data('id', [{
			product: ID
		}]); //set the data attribute on the modal button
		$('#delete-confirm .modal-body').text("Bạn muốn xóa sản phẩm này")
	});

	$('#delete-confirm-btn').on('click', function () {
		var ID = $(this).data('id');
		$.ajax({
			url: "/cart/remove",
			type: "post",
			data: {
				data: ID
			},
			success: function (data) {
				$("#delete-confirm").modal('hide');
				location.reload();
			}
		});
	})



	/*------------------
		Single Product
	--------------------*/
	$('.product-thumbs-track > .pt').on('click', function () {
		$('.product-thumbs-track .pt').removeClass('active');
		$(this).addClass('active');
		var imgurl = $(this).data('imgbigurl');
		var bigImg = $('.product-big-img').attr('src');
		if (imgurl != bigImg) {
			$('.product-big-img').attr({
				src: imgurl
			});
			$('.zoomImg').attr({
				src: imgurl
			});
		}
	});


	$('.product-pic-zoom').zoom();



})(jQuery);