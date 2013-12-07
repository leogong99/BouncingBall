(function(){
	"use strict"
    var GAME_REFRESH_RATE = 50;
    var ACC_RATE = 300;
    var CONTENT_X = 0;
    var CONTENT_Y = 0;

    var circles = [];

    function clearCanvas(ctx) {
    	ctx.clearRect(0, 0, CONTENT_X, CONTENT_Y);
    }
    
    function drawCircles() {
    	var myCanvas = document.getElementById("myCanvas");
    	var ctx = myCanvas.getContext("2d");
    	clearCanvas(ctx);
    	for(var i = 0; i < circles.length; i++) {
    		drawCircle(ctx, circles[i]);
    	}
    }
    function get_random_color() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }
    function drawCircle(ctx, circle) {
    	ctx.beginPath();
    	ctx.arc(circle.pos.x, circle.pos.y, circle.size, 0 , 2*Math.PI);
    	ctx.fillStyle = circle.color;
    	ctx.fill();
    }
    
    function moveCircles(){
    	for(var i = 0; i < circles.length; i++) {
    		var newX = circles[i].pos.x + circles[i].step.x;
    		if(newX > CONTENT_X - circles[i].size) {
    			newX = CONTENT_X - circles[i].size;
    			circles[i].step.x = -circles[i].step.x / 4;
    		} else if(newX < circles[i].size) {
    			newX = circles[i].size;
    			circles[i].step.x = -circles[i].step.x / 4;
    		}
    		var newY = circles[i].pos.y + circles[i].step.y;
    		if(newY > CONTENT_Y - circles[i].size) {
    			newY = CONTENT_Y - circles[i].size;
    			circles[i].step.y = -circles[i].step.y / 4;
    		} else if(newY < circles[i].size) {
    			newY = circles[i].size;
    			circles[i].step.y = -circles[i].step.y / 4;
    		}
    		circles[i].pos.x = newX;
    		circles[i].pos.y = newY;
    	}
    }
    
    // Start watching the acceleration
    //
    function startWatch() {
        // Update acceleration every 0.3 seconds
        var options = { frequency: ACC_RATE };

        var watchID = navigator.accelerometer.watchAcceleration(updateSteps, onError, options);
    }

    function updateSteps(acceleration) {
    	for(var i = 0; i < circles.length; i++) {
    		circles[i].step.x += -acceleration.x / circles[i].defaultStep;
    		circles[i].step.y += acceleration.y / circles[i].defaultStep;
    	}
    }
    
    
    
    // onError: Failed to get the acceleration
    //
    function onError() {
        alert('onError!');
    }
    
    function gameStart() {
    	setInterval(function(){
    	   moveCircles();
    	   drawCircles();
    	}, GAME_REFRESH_RATE)
    }
    
    function addBall(e) {
    	var ramNum = Math.floor((Math.random()*10)+1);
    	circles.push({
	    	pos: {x: e.clientX, y: e.clientY},
	    	step:{x: 0, y: 0},
	    	defaultStep: 11 - ramNum,
	    	size: ramNum + 5,
	    	color: get_random_color()
	    });
    	 $('#numOfBall').text('Number of balls: ' + circles.length);
    	 if(circles.length === 1) {
     		startWatch();
     		gameStart();
     	}
    }
    
	return {
		init: function() {
			// Wait for device API libraries to load
		    //
			var canvas = document.getElementById('myCanvas');
			CONTENT_X = canvas.width = window.innerWidth - 20;
		    CONTENT_Y = canvas.height = window.innerHeight - 100;
		    $('#myCanvas').click(addBall);
		}()
	};
   
	
})();