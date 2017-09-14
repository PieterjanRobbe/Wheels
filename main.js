"use strict";

// ---------------- VARIABLES ----------------
var wheelCanvas = document.getElementById('WheelCanvas'),
	wheel = new Wheel(wheelCanvas),
	roadCanvas = document.getElementById('RoadCanvas'),
	road = new Road(roadCanvas);

window.onresize =  function(){ resize(wheel, road, wheelCanvas, roadCanvas); };

// ---------------- ACTION LISTENERS ----------------
wheelCanvas.addEventListener("mousedown", function(event){ wheelPress(wheel,event); }, false);
wheelCanvas.addEventListener("touchstart", function(event){ wheelPress(wheel,event); }, false);

wheelCanvas.addEventListener("mousemove", function(event){ wheelDragHandler(wheel,event); }, false);
wheelCanvas.addEventListener('touchmove', function(event){ wheelDragHandler(wheel,event); }, false);

wheelCanvas.addEventListener("mouseup", function(event){ wheelRelease(wheel,road,event); }, false);
wheelCanvas.addEventListener("touchend", function(event){ wheelRelease(wheel,road,event); }, false);

wheelCanvas.addEventListener("click", function(event){ wheelClick(wheel,road,event); }, false);

roadCanvas.addEventListener("mousedown", function(event){ roadPress(road); }, false);
roadCanvas.addEventListener("touchstart", function(event){ roadPress(road); }, false);

roadCanvas.addEventListener("mousemove", function(event){ roadDragHandler(wheel,road,event); }, false);
roadCanvas.addEventListener('touchmove', function(event){ roadDragHandler(wheel,road,event); }, false);

roadCanvas.addEventListener("mouseup", function(event){ roadRelease(road); }, false);
roadCanvas.addEventListener("touchend", function(event){ roadRelease(road); }, false);

image0.onload = function(){
	wheel.image = image0;
    drawWheel(wheel);
}

resize(wheel, road, wheelCanvas, roadCanvas)


