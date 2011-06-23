// Handles the running of a simulation

var height = window.innerHeight;
var width = window.innerWidth;

// Runs the given simulation, setting up the screen with the necessary
// elements in the process.
function run_simulation(sim) {
	document.title = "Cypress : "+sim.name;

	content = document.getElementById("content");
	display = document.getElementById("display");
	content.innerHTML = display.innerHTML;

	tabs = document.getElementById("tabs");
	tabsHeight = parseInt(getComputedStyle(tabs).height);

	canvas = document.getElementById("c");
	canvas.style.height = height - tabsHeight;

	description = document.getElementById("description");
	description.innerHTML = sim.description;

	sim.canvas = canvas;
	sim.start();
}

