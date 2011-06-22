// Handles the running of a simulation

var height = window.innerHeight;
var width = window.innerWidth;

function run_simulation(sim) {
	content = document.getElementById("content");
	content.innerHTML='<canvas id="c" width="'+width+'" height="'+height+'"></canvas>';
	
	canvas = document.getElementById("c");
	canvas.innerHTML="<p>Please download a modern browser.</p>";
	sim.canvas = canvas;
	sim.start();
}

