var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

(function() {
	var circleDimesion = 30;
	var exercise = null;
	var intervalFunction = null;
	var fullscreenMode = false;
	var cloneExercise = null;
	var defaultExercise = {
	 from: null,
	 to: null,
	 blink: false,
	 blinkSpeed: 0,
	 reps: 0,
	 duration: 0
	};

	function getData() {
		var exercise = defaultExercise;
		exercise.from = $('#from-input').val();
		exercise.to = $('#to-input').val();
		exercise.blink = $('#blink-check').val();
		exercise.blinkSpeed = $('#blink-speed-input').val();
		exercise.duration = $('#duration-input').val();
		exercise.reps = $('#reps-input').val();
		return exercise;
	}

	function showCountdown() {
		$('#clock').removeClass('hidden');
		$('#circle').hide();

    	var totalSeconds = new Date().getTime() + exercise.rest *1000;
    	$('#clock').countdown(totalSeconds, function(event) {
		  var totalHours = event.offset.totalDays * 24 + event.offset.hours;
		  $(this).html(event.strftime(totalHours + '%S sec'));
		});
	}

	function animateCircle(exercise) {
		if(exercise.reps > 0) {
			$('#circle').css(exercise.from);
			$('#circle').show();
			if(exercise.blink) {
				$('#circle').addClass('blink');
				$('#circle').css("animation-duration", 1/8*exercise.blinkSpeed + 's');
			}
			$('#circle').animate({top: exercise.to.top +'px', left: exercise.to.left +'px'}, exercise.duration*1000, function complete(){
		    	$('#circle').removeClass('blink');
		    	cloneExercise = jQuery.extend(true, {}, exercise);
		    	cloneExercise.reps--;

		    	if(cloneExercise.reps > 0) {
		    		showCountdown();
		    	}else {
					window.location.href = '/exercise-list.html';
				}
		    	
		    	intervalFunction = setTimeout(function(){ animateCircle(cloneExercise) }, exercise.rest *1000 + 100);
		    });
		} else {
			window.location.href = '/exercise-list.html';
		}
		
	}

	function stopAnimationByReps() {
	    clearTimeout(intervalFunction);
	}

	function stopAnimation() {
		$('#circle').hide();
		$('#circle').stop();
		$('#circle').removeClass('blink');
		stopAnimationByReps();
	}


	function startanimation() {
		$('.navbar').hide();
		$('.exercise-movement_wrapper').removeClass('hidden'); 
		$('#fullscreen-alert').hide();
		exercise.from = $('#span' + exercise.fromId).position();
		exercise.to = $('#span' + exercise.toId).position();
		animateCircle(exercise);
	}

	function onSucess(data) {
		exercise = data;

		$(window).resize(function () {
			//always sotpAnimation by default
			stopAnimation();
		    waitForFinalEvent(function(){
		       if(screen.width === window.innerWidth /*&& screen.height === window.innerHeight*/){
		       	// this is full screen
		    		startanimation();
	    		}else {
		    		$('.exercise-movement_wrapper').addClass('hidden'); 
					stopAnimation();
					$('.navbar').show();
					$('#fullscreen-alert').show();
		       }
		    }, 500, "some unique string");
		});

	}

	$(document).ready(function ready(){
		
		var id = common.getParameterByName('id');
		exerciseService.getExercise(id).then(onSucess,common.onError);
			
		$('#clock').on('finish.countdown', function() {
    		setTimeout(function(){ $('#clock').addClass('hidden'); },100);
	    });
	});

})();