// This uses require.js to structure javascript:
// http://requirejs.org/docs/api.html#define

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
function initializeBricks()
{

var unitWidth = width / blocksHorizontal;
var unitHeight = (height/heightFactor) / blocksVertical;
	for(var i=0;i<bricks.length;i++)
	{
		for (var j=0;j<bricks[i].length;j++)
		{
			bricks[i][j].status = 1;

			bricks[i][j].topleftx = unitWidth*j ;
			bricks[i][j].toplefty = unitHeight*i + topFloatMargin ;

			bricks[i][j].bottomrightx = unitWidth*j + unitWidth - 4;
			bricks[i][j].bottomrighty = unitHeight*i + unitHeight - 4 + topFloatMargin;
		}
	}
}
var width =  window.innerWidth - 20;;
var height = window.innerHeight - 20;
var topFloatMargin = 20;
var stickynessCtr = 20;
var level = 1;
var heightFactor = 2;

var lctr=0;
var rctr=0;
var won = false;
var gameOver = false;
var handle = setInterval(clearCtr, 1000);
var direction = 'topRight';

var blocksHorizontal = 3;
var blocksVertical = 10;
var radius = 15;
var batWidth = 100;
var bricks = new Array(blocksVertical);


var x=100;
var y=300;
var dx=3;
var dy=3;
var batLocation = 100;


function OneTimeInit()
{

width =  window.innerWidth - 20;
height = window.innerHeight - 20;
topFloatMargin = 20;
stickynessCtr = 20;

level = 1;
}
function Init(level)
{
	lctr=0;
	rctr=0;
	won = false;
	gameOver = false;
	handle = setInterval(clearCtr, 1000);
	direction = 'topRight';
	batLocation = 100;

	if(level == 1)
	{

		blocksHorizontal = 3;
		blocksVertical = 7;
		heightFactor = 3;
		radius = 15;
		batWidth = 100;
		dx=3;
		dy=3;
	}
	else if (level == 2)
	{

		blocksHorizontal = 4;
		blocksVertical = 10;
		heightFactor = 2;
		radius = 10;
		batWidth = 75;
		dx=4;
		dy=4;
	}
	else if (level == 3)
	{
		blocksHorizontal = 5;
		blocksVertical = 12;
		heightFactor = 2;
		radius = 7;
		batWidth = 50;
		dx=5;
		dy=5;
	}

	bricks = new Array(blocksVertical);
	  for (var i = 0; i < blocksVertical; i++)
	  {
	   	bricks[i] = new Array(blocksHorizontal);
		for (var j = 0; j < blocksHorizontal; j++)
		{
		    bricks[i][j] = new Array(5);
		}
	  }

	var halfWidth = width / 3;
	x=parseInt(halfWidth);
	console.log('x',x);
	var almostHeight = height - 30;
	y=parseInt(almostHeight);
	console.log('y',y);
	
	initializeBricks();
}

function clearCtr()
{
	lctr=0;
	rctr=0;
}

define(function(require) {
    // Zepto provides nice js and DOM methods (very similar to jQuery,
    // and a lot smaller):
    // http://zeptojs.com/
    var $ = require('zepto');

    // Need to verify receipts? This library is included by default.
    // https://github.com/mozilla/receiptverifier
    require('receiptverifier');

    // Want to install the app locally? This library hooks up the
    // installation button. See <button class="install-btn"> in
    // index.html
    require('./install-button');

    // Simple input library for our game
    var input = require('./input');

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    canvas.style = "border:solid black 1px";
    document.body.appendChild(canvas);

OneTimeInit();
Init(level);

/*bricks[2][4] = 1;
bricks[2][5] = 0;
bricks[1][4] = 1;
bricks[1][3] = 1;
bricks[0][9] = 1;
bricks[0][0] = 1;
bricks[2][6] = 1;*/


    // The player's state
    var player = {
        x: 0,
        y: 0,
        sizeX: 50,
        sizeY: 50
    };

    // Reset game to original state
    function reset() {
        player.x = 0;
        player.y = 0;
    };

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }
	

	// Update game objects
    function update(dt) {
	if(running == false)
		unpause();

        // Speed in pixels per second
        //var playerSpeed = 60;
        var playerSpeed = 10;

        if(input.isDown('DOWN')) {
            // dt is the number of seconds passed, so multiplying by
            // the speed gives u the number of pixels to move
            player.y += playerSpeed * dt;
        }

        if(input.isDown('UP')) {
            player.y -= playerSpeed * dt;
		//drawBricks();
        }

        if(input.isDown('LEFT')) {
	  //  console.log('Pressed Left');
	    rctr=0;
	    lctr++;
	    if(lctr > stickynessCtr)
	    {
		console.log('lctr > ',stickynessCtr);
		x -= 10;
		lctr=0;
	    }
	if(batLocation > 0)
		batLocation=batLocation-5;

	//console.log('lctr',lctr);
            player.x -= playerSpeed * dt;
        }

        if(input.isDown('RIGHT')) {
	if(batLocation < width-batWidth)
		batLocation=batLocation+5;
  	  //  console.log('Pressed Right');
	    lctr=0;
	    rctr++;
	    if(rctr > stickynessCtr)
	    {
		console.log('rctr > ',stickynessCtr);
		x += 10;
		rctr=0;
	    }
	//console.log('rctr',rctr);
            player.x += playerSpeed * dt;
        }
    };

    // Draw everything
    function render() {
	//rctr=0;
	//lctr=0;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //ctx.fillStyle = 'green';
        //ctx.fillRect(player.x, player.y, player.sizeX, player.sizeY);
	drawBall();
	drawBat();
	drawBricks();
	/*for(var i=0;i<10000;i++)
	{
		for(var j=0;j<1000;j++)
		{
		}
	}*/
    };

function drawBricks()
{
 for(var i=0;i<bricks.length;i++){
//	console.log(i);
	for (var j=0;j<bricks[i].length;j++)
	{
//		console.log(j);
		if(bricks[i][j].status == 1)
		{
			ctx.fillStyle = "rgb(150,29,28)";
			ctx.fillRect (bricks[i][j].topleftx, bricks[i][j].toplefty, bricks[i][j].bottomrightx-bricks[i][j].topleftx, bricks[i][j].bottomrighty-bricks[i][j].toplefty);
			//console.log (bricks[i][j].topleftx, bricks[i][j].toplefty, bricks[i][j].bottomrightx-bricks[i][j].topleftx, bricks[i][j].bottomrighty-bricks[i][j].toplefty);
		}

	}
  }  
}

function drawBat()
{
 //console.log('Drawing Bat');
 // context.clearRect(0,0, 300,100);
  ctx.fillStyle = "rgb(150,29,28)";
//  ctx.fillRect (batLocation,270,batLocation+batWidth,300);
  ctx.fillRect (batLocation,height-15,batWidth,10);
};
    function drawBall(){
	ctx.clearRect(0,0, width,height);
	ctx.beginPath();
	ctx.fillStyle="#0000ff";
	// Draws a circle of radius 20 at the coordinates 100,100 on the canvas
	ctx.arc(x,y,radius,0,Math.PI*2,true);
	ctx.closePath();
	ctx.fill();
	
	//if( x<20 || x>280) dx=-dx;
	//if( y<20 || y>280) dy=-dy;
	if(direction == 'topRight')
	{
		x+=dx;
		y-=dy;	
	}
	if(direction == 'topLeft')
	{
		x-=dx;
		y-=dy;	
	}
	if(direction == 'bottomRight')
	{
		x+=dx;
		y+=dy;	
	}
	else if(direction == 'bottomLeft')
	{
		x-=dx;
		y+=dy;	
	}
	
	checkCollision();
    };
    function checkCollision()
	{
		if(x <= 20) // Left Wall
		{
			if(direction == 'bottomLeft')
				direction = 'bottomRight';			
			if(direction == 'topLeft')
				direction = 'topRight';
//console.log (direction);
			return;
		}
		if(x >= width - 20) // Right Wall
		{
			if(direction == 'bottomRight')
				direction = 'bottomLeft';			
			if(direction == 'topRight')
				direction = 'topLeft';
//console.log (direction);
			return;
		}
		if(y+radius <= 20) // Top Wall
		{
			if(direction == 'topRight')
				direction = 'bottomRight';			
			if(direction == 'topLeft')
				direction = 'bottomLeft';
//console.log (direction);
			return;
		}
		if(y >= height-20) // Bottom Wall
		{
			if(checkIfGaveOver())
			{
				gameOver = true;
				alert('Game Over!');
				Init(level);
				//if(running == false)
				//	unpause();
			}

			if(direction == 'bottomRight')
				direction = 'topRight';			
			if(direction == 'bottomLeft')
				direction = 'topLeft';
//console.log (direction);
			return;
		}
		
		var topPointx = x;
		var topPointy = y; // - radius;
		//console.log("TopPoint");
		//console.log(topPointx, topPointy);
		 for(var i=0;i<bricks.length;i++)
		{
		//	console.log(i);
			for (var j=0;j<bricks[i].length;j++)
			{
		//		console.log(j);
				if(bricks[i][j].status == 1)
				{
					//console.log (bricks[i][j].topleftx, bricks[i][j].toplefty, bricks[i][j].bottomrightx, bricks[i][j].bottomrighty);
					if(topPointx >= bricks[i][j].topleftx && topPointx <= bricks[i][j].bottomrightx
						&& topPointy >= bricks[i][j].toplefty && topPointy <= bricks[i][j].bottomrighty)
					{
						//console.log ("Yeah");
						bricks[i][j].status = 0;
						if(direction == 'topRight')
							direction = 'bottomRight';
						if(direction == 'topLeft')
							direction = 'bottomLeft';
						/*if(direction == 'bottomRight')
							direction = 'topRight';
						if(direction == 'bottomLeft')
							direction = 'topLeft';*/
						//console.log (direction);
						if(checkIfAllDone())
						{
							won = true;
							alert('You Won');
							if(level < 3)
								Init(level+1);
						}
					}
				}
			}	
		}
	}
	function checkIfGaveOver()
	{
		if(x < batLocation - 15 || x > batLocation + batWidth + 15)
		{
			return true;
		}
		return false;
	}
	function checkIfAllDone()
	{
		for(var i=0;i<bricks.length;i++)
		{
			for (var j=0;j<bricks[i].length;j++)
			{
				if(bricks[i][j].status == 1)
				{
					return false;
				}
			}
		}	
		return true;
	}
    // The main game loop
    function main() {
        if(!running) {
            return;
        }

        var now = Date.now();
        var dt = (now - then) / 1000.0;

        update(dt);
        render();

        then = now;
        requestAnimFrame(main);
    };

    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    // Let's play this game!
    reset();
    var then = Date.now();
    var running = true;
    main();
});
