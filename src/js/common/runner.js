// Handles the running of a simulation

var height = window.innerHeight;
var width = window.innerWidth;

var the_sim;

window.onresize = sizeCanvas;

function sizeCanvas() {
	sim = the_sim;

	// get the height of the tabs
	tabsDiv = document.getElementById("tabs");
	tabsHeight = parseInt(getComputedStyle(tabsDiv).height);

	// size the canvas
	canvas.style.height = height - tabsHeight;
	canvas.height = parseInt(canvas.style.height);
	canvas.width = parseInt(getComputedStyle(canvas).width);
	sim.height = canvas.height;
	sim.width = canvas.width;
}

// Runs the given simulation, setting up the screen with the necessary
// elements in the process.
function run_simulation(sim) {
	the_sim = sim;
	document.title = "Cypress : "+sim.name;

	content = document.getElementById("content");
	display = document.getElementById("display");
	content.innerHTML = display.innerHTML;

	// set up (and size) the canvas
	canvas = document.getElementById("c");
	sizeCanvas();

	// set up the description
	description = document.getElementById("description");
	description.innerHTML = sim.description;

	// set up the tabs
	tabsDiv = document.getElementById("tabs");
	for (var t in sim.tabs) {
		tabsDiv.appendChild(createTab(t));
	}
	// add the pause/run button
	{
		var pb = document.createElement('div');
		pb.className = "rtab";
		pb.innerHTML = "Pause"; // TODO get an image
		tabsDiv.appendChild(pb);

		var rb = document.createElement('div');
		rb.className = "rtab";
		rb.innerHTML = "Continue"; // TODO get an image
		
		function pause() {
			tabsDiv.removeChild(pb);
			tabsDiv.appendChild(rb);
		}
		pb.onclick = pause;

		function cont() {
			tabsDiv.removeChild(rb);
			tabsDiv.appendChild(pb);
		}
		rb.onclick = cont;
	}

	sim.canvas = canvas;

	// TODO wait for images to load


	sim.start();
}

function createTab(name) {
	s = document.createElement('div');
	s.id = name+"Tab";
	s.name = name;
	s.className = "tab";
	s.innerHTML = name;
	s.onclick = function() {
		sim.currentTab = this.name;
	}
	return s;
}

