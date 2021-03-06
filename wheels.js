"use strict";

// ---------------- TYPES ----------------
function Wheel(canvas) {// determine available width and height
	var w = window.innerWidth;

	// deduce optimal WheelCanvas size
	wheelCanvas.height = Math.min(300,Math.max(150,w/3));
	wheelCanvas.width = wheelCanvas.height/6*8;

	this.context = canvas.getContext('2d');
	this.canvasLeft = canvas.offsetLeft;
	this.canvasTop = canvas.offsetTop;
	this.canvasWidth = canvas.width;
	this.canvasHeight = canvas.height;
	this.firstClick = true;
	this.paint = false;
	this.straight = false;
	this.clickX = [];
	this.clickY = [];
	this.angle = [];
	this.radius = [];
	this.nbOfPoints = 300;
	this.image = new Image();
}

// ---------------- FUNCTIONS ----------------

// reset wheel
function resetWheel(wheel) {
	wheel.firstClick = true;
	wheel.paint = false;
	wheel.straight = false;
	wheel.clickX = [];
	wheel.clickY = [];
	wheel.angle = [];
	wheel.radius = [];
}

// clicking on the wheel canvas
function wheelPress(wheel, event) {
	var x = event.pageX - wheel.canvasLeft,
		y = event.pageY - wheel.canvasTop;
	event.preventDefault();
	if ( isInsideDrawingArea(wheel,x) && !wheel.straight ) {

		if (wheel.firstClick) { // enable painting
			wheel.paint = true;
			wheel.firstClick = false;
		}
		if (wheel.paint) { // add first point
			addClick(wheel,x,y);
			drawWheel(wheel);
		}
	}
}

// drag handler for touch events
function wheelDragHandler(wheel,event) {
	if ( (event.clientX) && (event.clientY) ) {
		wheelDrag(wheel,event);
	} else if (event.targetTouches) {
		event.preventDefault();
		wheelDrag(wheel,event.targetTouches[0]);
	}
}

// dragging on the wheel canvas
function wheelDrag(wheel, event) {
	var x = event.pageX - wheel.canvasLeft,
		y = event.pageY - wheel.canvasTop;

	if ( wheel.paint && isInsideDrawingArea(wheel,x) ) { // add new point
		addClick(wheel,x,y);
		drawWheel(wheel);
	} else if ( wheel.straight ) {
	    drawWheel(wheel);
            drawStraightLine(wheel,x,y);
        }
}

// mouse release on the wheel canvas
function wheelRelease(wheel, road, event) {
	if (wheel.paint) {
		var x = event.pageX - wheel.canvasLeft,
			y = event.pageY - wheel.canvasTop;
		event.preventDefault();
		// connect release point and first point of wheel
		fillGap(wheel,x,y,wheel.clickX[0],wheel.clickY[0]) 
		// disable paint and show result
		wheel.paint = false;
		drawWheel(wheel);

                // action when wheel is closed
                wheelIsClosed(wheel,road);
	}
}

function wheelIsClosed(wheel,road) {
    // convert to polar coordinates
    toPolarCoordinates(wheel);

    // check if the wheel is valid
    if ( !isValidWheel(wheel) ) {
	alert("invalid wheel!");
	resetWheel(wheel);
	drawWheel(wheel);
    } else { // if so, interpolate and compute the corresponding road
	sortWheel(wheel);
	interpolateWheel(wheel);
	computeRoad(wheel, road);
	drawRoad(wheel, road);
	roadClick(wheel, road, road.canvasWidth/2); // draw wheel on road
    }
}

// mouse click on the wheel canvas
function wheelClick(wheel, road, event) {
	var x = event.pageX - wheel.canvasLeft,
	    y = event.pageY - wheel.canvasTop;
	event.preventDefault();
	if ( !isInsideDrawingArea(wheel,x) ) {
		var borderWidth = ( wheel.canvasWidth - wheel.canvasHeight )/2;
		if (x < borderWidth ) {
			if (y < borderWidth) {
				wheel.image = image0;
				clearAll(wheel, road)
			}
		} else if (x > wheel.canvasWidth - borderWidth) {
			if (y < borderWidth) {
				wheel.image = image0;
				clearAll(wheel, road);
			} else if (y < 2*borderWidth) {
                                wheel.image = image1;
                                clearAll(wheel, road);
				wheel.straight = true;
                                wheel.firstClick = false;
                        } else {
				clearAll(wheel, road);
				var r;
				if (y < 3*borderWidth) {
					wheel.image = image2;
					r = r1;
				} else if (y < 4*borderWidth) {
					wheel.image = image3;
					r = r2;
				} else if (y < 5*borderWidth) {
					wheel.image = image4;
					r = r3;
				} else if (y < 6*borderWidth) {
					wheel.image = image5;
                           		r = r4;
				}

				for(var i=0; i < wheel.nbOfPoints+1; i++) {
					wheel.angle.push(-Math.PI + i*2*Math.PI/wheel.nbOfPoints);
					wheel.radius.push(wheel.canvasHeight/2*r(wheel.angle[i]));
				}
				wheel.firstClick = false;
				toCartesianCoordinates(wheel);
				drawWheel(wheel);
				computeRoad(wheel, road);
				drawRoad(wheel, road);
				roadClick(wheel, road, road.canvasWidth/2); // draw wheel on road
			}
		}
	} else if (wheel.straight) {
            if ( wheel.clickX.length === 0 ) {
                addClick(wheel,x,y);    
            }   else {
                if ( distanceBetween(wheel.clickX[0],wheel.clickY[0],x,y) < wheel.canvasHeight/25 ) {
                    fillGap(wheel,wheel.clickX[wheel.clickX.length-1],wheel.clickY[wheel.clickY.length-1],wheel.clickX[0],wheel.clickY[0]);
                    wheel.straight = false;
                    drawWheel(wheel);
                    wheelIsClosed(wheel,road);
                } else {
                    fillGap(wheel,wheel.clickX[wheel.clickX.length-1],wheel.clickY[wheel.clickY.length-1],x,y)
                    drawWheel(wheel);
                }
            }
        }
}

// predefined wheels
function r1(t){ return 0.8/(Math.abs(Math.cos(t))+Math.abs(Math.sin(t))); };
function r2(t){ return 2/3*(1 + .25*Math.abs(Math.sin(3*(t)))); };
function r3(t){
	var a = -Math.PI/2-Math.PI/5,
		b = -Math.PI/2+Math.PI/5;
	return Math.abs(0.6*1/Math.sin(a + ( (t+Math.PI/2-a) % (b-a) ) ));
};
function r4(t){ return 0.6*Math.abs(1 + 0.3*Math.sin(5*t - Math.PI/2)); };

// ---------------- UTILS ----------------

// add new point to the wheel
function addClick(wheel,x,y)
{
	wheel.clickX.push(x);
	wheel.clickY.push(y);
}

function isInsideDrawingArea(wheel,x)
{
	var borderWidth = ( wheel.canvasWidth - wheel.canvasHeight )/1.95 // (1.95 is safety)
	if ( (x > borderWidth) && (x < wheel.canvasWidth - borderWidth) ) {
		return true
	} else {
		return false
	}
}

function clearAll(wheel, road) {
	resetWheel(wheel)
	resetRoad(road)
	drawWheel(wheel)
	drawRoad(wheel, road)
}
