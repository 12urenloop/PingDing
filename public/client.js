let ctx;
let canvas;
const img = new Image();
img.src = "https://zinc.zeus.gent/"
let station_data = {};
getStationData();

function onLoad() {
	canvas = document.getElementById("field");
	ctx = canvas.getContext("2d");
	getStations();
	interval = setInterval(getStations, 1000);
};

function getStations() {
	return fetch("/api").then((res) => res.json())
				      .then(drawStations)
}


function getStationData() {
	return fetch("/stations.json").then((res) => res.json())
                                                            .then((s) => station_data = s)
}

function drawStations(stations) {
	reload();
	stations.forEach(drawStation);
	ctx.fillStyle = "#000000";
	ctx.fillText(getTimestamp(), 300,390);
}

function getTimestamp() {
	const currDate = new Date();
	const year = currDate.getFullYear();
	const month = currDate.getMonth() + 1;
	const day = currDate.getDate();
	const hour = currDate.getHours();
	let minutes = currDate.getMinutes();
	let seconds = currDate.getSeconds();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return year + "/" + month + "/" + day + " @ " + hour + ":" + minutes + ":" + seconds;
}

function drawStation(station) {
	ctx.fillStyle = station.alive ? "#00FF00" : "#FF0000";
	ctx.beginPath();
	ctx.arc(station.canvasX, station.canvasY, 20, 0, 2*Math.PI);
	ctx.fill();
	ctx.textBaseline = 'middle';
	ctx.textAlign = 'center';
	ctx.font = "25px Arial";
	ctx.fillStyle = station.color;
	ctx.fillText(station.name, station.canvasX, station.canvasY - 30);
	ctx.fillText(station.host.slice(-1), station.canvasX, station.canvasY)
}

function reload() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.arc(200,200,150,(1/2)*Math.PI,(3/2)*Math.PI);
	ctx.arc(400,200,150,(3/2)*Math.PI,(1/2)*Math.PI);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle = "#ff7f00";
	ctx.fillRect(470,125,35,70);
	rotateAndPaintImage ( ctx, img, (1/2)*Math.PI, 498, 142, 0, 0 ) 
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.moveTo(430,325);
	ctx.lineTo(440,365);
	ctx.stroke();
}

function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
	context.translate( positionX, positionY );
	context.rotate( angleInRad );
	context.drawImage( image, -axisX, -axisY , 35, 23);
	context.rotate( -angleInRad );
	context.translate( -positionX, -positionY );
}
