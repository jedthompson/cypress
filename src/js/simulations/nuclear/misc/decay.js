var simulation_name = "Nuclear Decay";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;

function init_state(state) {
	state.pc = 100;
	state.hl = 30;
	state.dc = Math.LN2/state.hl;
	state.t = 0;
	state.pd = state.dc;

	state.decayed = new Array(10);
	for (var x=0; x<10; x++) {
		state.decayed[x] = new Array(10);
		for (var y=0; y<10; y++) {
			state.decayed[x][y] = false;
		}
	}
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	state.pc = state.pc*(1-state.pd);

	for (var x=0; x<10; x++) {
		for (var y=0; y<10; y++) {
			if (Math.random() < state.pd) {
				state.decayed[x][y] = true;
			}
		}
	}

	if (state.t > 500) { // TODO put a reset button somewhere
		state = init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	for (var x=0; x<10; x++) {
		for (var y=0; y<10; y++) {
			if (!state.decayed[x][y]) {
				c.drawImage(window.images["particle-red"],
					(8*x)-40, (8*y)-40, 8, 8);
			} else {
				c.drawImage(window.images["particle-grey"],
					(8*x)-40, (8*y)-40, 8, 8);
			}
		}
	}
}

simulation.renderGraph = function(state, c, w, h) {
	/*gc.clearRect(0, 0, c.width, c.height);
	gc.beginPath();
	gc.moveTo(20, 20);
	gc.lineTo(20, 280);
	gc.lineTo(280, 280);
	gc.stroke();*/

	//gc.lineTo(20+t, 280-pc*2);
	//gc.stroke();

}

/*function begin_simulation() {
	var pc = 100;
	var hl = 30; // half-life
	var dc = Math.LN2/hl; // decay constant
	var t = 0;
	var pd = dc; // probability of decay

	// draw the axes
	var c = document.getElementById("c");
	var gc = c.getContext("2d");
	gc.clearRect(0, 0, c.width, c.height);
	gc.beginPath();
	gc.moveTo(20, 20);
	gc.lineTo(20, 280);
	gc.lineTo(280, 280);
	gc.stroke();

	var gd = document.getElementById("d").getContext("2d");
	gd.fillRect(100,100,100,100);
	gd.fillStyle="#ddd";

	// draw the first point
	gc.beginPath();
	gc.moveTo(20, 280-pc*2);

	run_simulation();
	function run_simulation() {
		// really, just a hack around step() to avoid cluttering step with setTimeout
		step();
		setTimeout(run_simulation, 50);
	}

	function step() {
		t++;
		pc = pc*(1-pd);
		gc.lineTo(20+t, 280-pc*2);
		gc.stroke();

		for (var x=0; x<10; x++) {
			for (var y=0; y<10; y++) {
				if (Math.random() < pd) {
					gd.fillRect(100+(10*x), 100+(10*y), 10, 10);
				}
			}
		}
	}

}*/

