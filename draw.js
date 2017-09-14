// ---------------- VARIABLES ----------------
var image0 = new Image(),
	image1 = new Image(),
	image2 = new Image(),
	image3 = new Image(),
	image4 = new Image();

// Load images
image0.src = "art/p4.png";
image1.src = "art/p3.png";
image2.src = "art/p2.png";
image3.src = "art/p1.png";
image4.src = "art/p0.png";

// draw wheel on wheel canvas
function drawWheel(wheel) {

	// clear the canvas and plot outline
	wheel.context.clearRect(0, 0, wheel.canvasWidth, wheel.canvasHeight);
	wheel.context.drawImage(wheel.image, 0, 0, wheel.canvasWidth, wheel.canvasHeight);

	// plot axle
	wheel.context.fillStyle = "#df4b26";
	wheel.context.beginPath();
	wheel.context.arc(wheel.canvasWidth/2,wheel.canvasHeight/2,wheel.canvasWidth/30,0,2*Math.PI);
	wheel.context.closePath();
	wheel.context.fill();

	// plot wheel
	wheel.context.strokeStyle = "#df4b26";
	wheel.context.lineJoin = "round";
	wheel.context.lineWidth = wheel.canvasWidth/75;
			
	for(var i=1; i < wheel.clickX.length; i++) {		
		wheel.context.beginPath();
		wheel.context.moveTo(wheel.clickX[i-1], wheel.clickY[i-1]);
		wheel.context.lineTo(wheel.clickX[i], wheel.clickY[i]);
		wheel.context.closePath();
		wheel.context.stroke();
	}
};

// draw wheel on road canvas
function drawWheelOnRoad(wheel, road, k, x) {

	// plot axle
	road.context.fillStyle = "#df4b26";
	road.context.beginPath();
	road.context.arc(x,road.canvasHeight/2,wheel.canvasHeight/20,0,2*Math.PI);
	road.context.closePath();
	road.context.fill();
	
	// plot wheel
	road.context.strokeStyle = "#df4b26";
	road.context.lineJoin = "round";
	road.context.lineWidth = wheel.canvasWidth/75;
	for(var i=1; i < wheel.radius.length; i++) {		
		road.context.beginPath();
		road.context.moveTo( x + wheel.radius[i-1]*Math.cos(wheel.angle[i-1]-wheel.angle[k]-Math.PI/2),
			road.canvasHeight/2-wheel.radius[i-1]*Math.sin(wheel.angle[i-1]-wheel.angle[k]-Math.PI/2) );
		road.context.lineTo( x + wheel.radius[i]*Math.cos(wheel.angle[i]-wheel.angle[k]-Math.PI/2),
			road.canvasHeight/2-wheel.radius[i]*Math.sin(wheel.angle[i]-wheel.angle[k]-Math.PI/2) );
		road.context.closePath();
		road.context.stroke();
	}
}

// draw road on road canvas
function drawRoad(wheel, road) {
	road.context.clearRect(0, 0, road.canvasWidth, road.canvasHeight);

	// draw the road
	if (road.X.length > 0) {

		road.context.strokeStyle = "#5e3fc1";
		road.context.lineJoin = "round";
		road.context.lineWidth = wheel.canvasHeight/75;

		ncycles = Math.ceil(road.canvasWidth/road.X[road.X.length-1])

		// leftmost point ouside canvas
		road.context.beginPath();
		road.context.moveTo(0, 
			road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[road.X.length-1]);
		road.context.lineTo(road.X[0], 
			road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[0]);
		road.context.closePath();
		road.context.stroke();

		for(var ntimes = 0; ntimes<ncycles; ntimes++) {
			// all other points
			for(var i=1; i <= road.X.length-1; i++) {		
				road.context.beginPath();
				road.context.moveTo(ntimes*road.X[road.X.length-1]+road.X[i-1], 
					road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[i-1]);
				road.context.lineTo(ntimes*road.X[road.X.length-1]+road.X[i], 
					road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[i]);
				road.context.closePath();
				road.context.stroke();
			}
			// cennection
			road.context.beginPath();
			road.context.moveTo(ntimes*road.X[road.X.length-1]+road.X[road.X.length-1], 
					road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[road.X.length-1]);
			road.context.lineTo((ntimes+1)*road.X[road.X.length-1]+road.X[0], 
					road.canvasTop/2+(road.canvasHeight-wheel.canvasHeight)/2+wheel.radius[0]);
			road.context.closePath();
			road.context.stroke();
		}
	}
}
