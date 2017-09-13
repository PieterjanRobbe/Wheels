"use strict";

function toPolarCoordinates(wheel)
{
	var minidx = 0, // index closest to -\pi
		minimum = Infinity,
		angle = [],
		radius = [];

	// transform wheel using atan2 and find index closest to -\pi
	for(var i=0; i < wheel.clickX.length; i++) {
		var x = wheel.clickX[i] - wheel.canvasWidth/2,
			y = -wheel.clickY[i] + wheel.canvasHeight/2,
			myAngle = Math.atan2(y, x);
		if (Math.abs(myAngle+Math.PI) < minimum) {
			minidx = i;
			minimum = Math.abs(myAngle+Math.PI);
		}
		angle.push(myAngle);
		radius.push(Math.sqrt( Math.pow(x,2) + Math.pow(y,2) ));
	}

	// circshift to ensure that theta is between -\pi and \pi	
	angle = circshift(angle, minidx);
	radius = circshift(radius, minidx);

	// shift one more in case the wheel is decreasing
	// TODO try to avoid this extra circshift...
	if ( angle[0] < 0 && angle[1] > 0 ) {
		angle = circshift(angle, 1);
		radius = circshift(radius, 1);
	}

	wheel.angle = angle;
	wheel.radius = radius;
}

function toCartesianCoordinates(wheel) {
	for(var i=0; i < wheel.angle.length; i++) {
		wheel.clickX.push(wheel.radius[i]*Math.cos(wheel.angle[i])+wheel.canvasWidth/2);
		wheel.clickY.push(wheel.radius[i]*Math.sin(wheel.angle[i])+wheel.canvasHeight/2);
	}
}

function isValidWheel(wheel) {
	var angleRange,
		minX = Math.min.apply(null, wheel.clickX),
		maxX = Math.max.apply(null, wheel.clickX),
		minY = Math.min.apply(null, wheel.clickY),
		maxY = Math.max.apply(null, wheel.clickY);

	angleRange = Math.abs(wheel.angle[wheel.angle.length-1] - wheel.angle[0]);
		//( isMonotoneIncreasing(wheel.angle) || isMonotoneDecreasing(wheel.angle) ) &&
	return (angleRange > Math.PI/2) && 
		(minX < wheel.canvasWidth/2) && 
		(maxX > wheel.canvasWidth/2) && 
		(minY < wheel.canvasHeight/2) && 
		(maxY > wheel.canvasHeight/2);
};

function isMonotoneIncreasing(array) {
	return array.every(function(e, i, a) { if (i) return e >= a[i-1]; else return true; })
};

function isMonotoneDecreasing(array) {
	return array.every(function(e, i, a) { if (i) return e <= a[i-1]; else return true; })
};

function sortWheel(wheel) {
	if ( wheel.angle[0] > wheel.angle[1] ) {
		wheel.angle.reverse();
		wheel.radius.reverse();
	}
}

function interpolateWheel(wheel) {
	// append last value, and...
	wheel.angle.push(wheel.angle[0]+2*Math.PI);
	wheel.radius.push(wheel.radius[0]);

	// push first value
	wheel.angle.unshift(wheel.angle[wheel.angle.length-2]-2*Math.PI);
	wheel.radius.unshift(wheel.radius[wheel.radius.length-2]);

	// k loops over all angle data points
	// i loops over all interpolation points
	var k = 0, i = 0, curr, vp = [], xp = [], rico;
	rico = (wheel.radius[k+1]-wheel.radius[k])/(wheel.angle[k+1]-wheel.angle[k]);
	while ( (i <= wheel.nbOfPoints) && (k < wheel.angle.length) ) {
		curr = -Math.PI + i*2*Math.PI/wheel.nbOfPoints;
		if ( (curr >= wheel.angle[k]) && (curr <= wheel.angle[k+1]) ) {
			xp.push(curr);
			vp.push(wheel.radius[k]+(curr-wheel.angle[k])*rico);
			i = i+1;
		} else {
			k = k+1;
			rico = (wheel.radius[k+1]-wheel.radius[k])/(wheel.angle[k+1]-wheel.angle[k]);
		}
	}
	wheel.angle = xp;
	wheel.radius = vp;
}

// add points between the release point and the origin
function fillGap(wheel,x0,y0) {
	var x1 = wheel.clickX[0],
		y1 = wheel.clickY[0],
		dist = Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2)),
		npoints = Math.round(100/wheel.canvasWidth*dist),
		xpts = linspace(x0,x1,npoints),
		ypts = linspace(y0,y1,npoints);

	for(var i=1;i<xpts.length;i++) { addClick(wheel,xpts[i],ypts[i]); }
}
