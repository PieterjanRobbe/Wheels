"use strict";

// shift all entries in array by i positions
function circshift(x, i) {
	return x.slice(i,x.length-1).concat(x.slice(0,i));
};

// generate n equidistant point between a and b
function linspace(a,b,n) {
	if (typeof n === "undefined") n = Math.max(Math.round(b-a)+1,1);
	if (n < 2) { return n===1?[a]:[]; }
	var i,
		ret = Array(n);
	n--;
	for (i=n; i > 0; i--) { ret[i] = (i*b+(n-i)*a)/n; }
	return ret;
};

// compute road
function computeRoad(wheel, road) {

	var dTheta = 2*Math.PI/wheel.nbOfPoints;

	// forward euler in equidistant points
	road.X.push(wheel.radius[0]*dTheta);
	for (var i = 1; i < wheel.angle.length-1; i++) {
  		road.X.push(road.X[i-1] + wheel.radius[i]*dTheta);
	}
};
