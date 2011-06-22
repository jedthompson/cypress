// Handles the running of a simulation

var height = window.innerHeight;
var width = window.innerWidth;

function run_simulation(sim) {
	document.title = "Cypress : "+sim.name;

	content = document.getElementById("content");
	display = document.getElementById("display");
	content.innerHTML = display.innerHTML;

	canvas = document.getElementById("c");
	canvas.width = width;
	canvas.height = height;

	sim.canvas = canvas;
	sim.start();
}

