"use strict";

// ---------------- TYPES ----------------
function Road(canvas) {
	this.context = canvas.getContext('2d');
	this.canvasLeft = canvas.offsetLeft;
	this.canvasTop = canvas.offsetTop;
	this.canvasWidth = window.innerWidth;
	this.canvasHeight = canvas.height;
	this.paint = false;
	this.X = [];

	roadCanvas.width = this.canvasWidth;
	canvas.height = this.canvasHeight;
}

// ---------------- FUNCTIONS ----------------

// reset road
function resetRoad(road) {
	road.paint = false;
	road.X = [];
}

// clicking on the road canvas
function roadPress(road) {
	road.paint = true;
}

// drag handler for touch events
function roadDragHandler(wheel,road,event) {
	if ( (event.clientX) && (event.clientY) ) {
		roadDrag(wheel,road,event);
	} else if (event.targetTouches) {
		event.preventDefault();
		roadDrag(wheel,road,event.targetTouches[0]);
	}
}

// dragging on the road canvas
function roadDrag(wheel, road, event) {
	if (road.paint) {
		var x = event.pageX - road.canvasLeft;
		roadClick(wheel, road, x);
	}
}

function roadClick(wheel, road, x) {
	var ncycles = Math.ceil(x/road.X[road.X.length-1])-1,
		xMod = x % road.X[road.X.length-1],
		k = computeWheelPosition(road,xMod);

		drawRoad(wheel, road);
		drawWheelOnRoad(wheel, road, k, ncycles*road.X[road.X.length-1]+road.X[k]);
}

// mouse release on the road canvas
function roadRelease(road) {
	road.paint = false;
}

// ---------------- UTILS ----------------

function computeWheelPosition(road,xClick) {
	var minimalDistance = Infinity,
		indexOfClosest = 0,
		i=0;

	for(i=0; i<road.X.length; i++) {
		if ( Math.abs(xClick-road.X[i]) < minimalDistance ) {
			indexOfClosest = i;
			minimalDistance = Math.abs(xClick-road.X[i]);
		}
	}
	return indexOfClosest
}

// function to be called when rescaling the window
function resize(wheel, road, wheelCanvas, roadCanvas) {
	
	road.canvasWidth = window.innerWidth;
	roadCanvas.width = road.canvasWidth;

	road.canvasHeight = Math.sqrt(2)*wheelCanvas.height;
	roadCanvas.height = road.canvasHeight;

	wheel.canvasLeft = wheelCanvas.offsetLeft;
	wheel.canvasTop = wheelCanvas.offsetTop;

	//computeRoad();
	drawWheel(wheel);
    drawRoad(wheel, road);
    roadClick(wheel, road, road.canvasWidth/2); // draw wheel on road
};
