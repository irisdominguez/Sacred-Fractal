var FractalConfig = function() {
	this.iterations = 3;
	this.petals = 6;
	this.innerCircle = true;
	this.innerFlower = true;
	this.grabImage = function() {
		var dataURL = document.getElementById("fractalCanvas").toDataURL('image/png');
		window.open(dataURL, '_blank');
	};
};

var fcg = new FractalConfig();
var c = document.getElementById("fractalCanvas");
var ctx = c.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var width = ctx.canvas.width;
var height = ctx.canvas.height;
var winSize = Math.min(width, height);
var size = winSize * 0.25 * 0.8;

function redraw() {
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	width = ctx.canvas.width;
	height = ctx.canvas.height;
	winSize = Math.min(width, height);
	size = winSize * 0.25 * 0.8;

	var t0 = performance.now();
	clearCanvas();
	drawFlowerOfLife(width * 0.5, height * 0.5, size, fcg.iterations);
	var t1 = performance.now();
	console.log("Redraw done in " + (t1 - t0) + " milliseconds.");
};

window.addEventListener('resize', redraw, false);

window.onload = function() {
	var gui = new dat.GUI();
	gui.add(fcg, 'iterations', 1, 6).step(1).onChange(redraw);
	gui.add(fcg, 'petals', 1, 20).step(1).onChange(redraw);
	gui.add(fcg, 'innerCircle').onChange(redraw);
	gui.add(fcg, 'innerFlower').onChange(redraw);
	gui.add(fcg, 'grabImage');

	redraw();
};


function clearCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
}

function drawFlowerOfLife(x, y, rad, level) {
	if (level == 0) return;

	ctx.strokeStyle = '#fff';
	ctx.lineWidth = rad / size;

	if (fcg.innerCircle) {
		ctx.beginPath();
		ctx.arc(x, y, rad, 0, 2 * Math.PI);
		ctx.stroke();
	}

	if (fcg.innerFlower) {
		drawFlowerOfLife(x, y, rad * 0.5, level - 1);
	}

	for (var i = 0; i < fcg.petals; i++) {
		var angle = (Math.PI * 2) / fcg.petals * i;
		var nx = x + rad * Math.sin(angle);
		var ny = y + rad * Math.cos(angle);
		ctx.lineWidth = rad / size;
		ctx.beginPath();
		ctx.arc(nx, ny, rad, 0, 2 * Math.PI);
		ctx.stroke();
		drawFlowerOfLife(nx, ny, rad * 0.5, level - 1);
	}
}
