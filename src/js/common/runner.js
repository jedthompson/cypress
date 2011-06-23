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

	// get the height of the tabs
	tabsDiv = document.getElementById("tabs");
	tabsHeight = parseInt(getComputedStyle(tabsDiv).height);

	// set up (and size) the canvas
	canvas = document.getElementById("c");
	canvas.style.height = height - tabsHeight;
	canvas.height = parseInt(canvas.style.height);
	canvas.width = parseInt(getComputedStyle(canvas).width);
	sim.height = parseInt(canvas.style.height);
	sim.width = canvas.width;

	// set up the description
	description = document.getElementById("description");
	description.innerHTML = sim.description;

	// set up the tabs
	for (var t in sim.tabs) {
		tabsDiv.appendChild(createTab(t));
	}

	sim.canvas = canvas;
	sim.start();
}

function createTab(name) {
	s = document.createElement('div');
	s.id = name+"Tab";
	s.class = "tab";
	s.innerHTML = name;
	return s;
}

