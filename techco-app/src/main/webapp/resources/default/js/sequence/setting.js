$(document).ready(function(){
	var options = {
		nextButton: true,
		prevButton: true,
		animateStartingFrameIn: true,
		autoPlay: true,
		autoPlayDelay: 5000,
		preloader: true,
		transitionThreshold: 200,
		moveActiveFrameToTop: true,
		fallback: {
			theme: "slide",
			speed: 500
		}
	};

	var sequence = $("#sequence").sequence(options).data("sequence");

	sequence.afterLoaded = function(){
		$("#sequence").hover(
			function() {
				$(".sequence-prev, .sequence-next").stop().animate({opacity:0.7},300);
			},
			function() {
				$(".sequence-prev, .sequence-next").stop().animate({opacity:0.3},300);
			}
		);

		$(".sequence-prev, .sequence-next").hover(
			function() {
				$(this).stop().animate({opacity:1},200);
			},
			function() {
				$(this).stop().animate({opacity:0.7},200);
			}
		);
	}
})
