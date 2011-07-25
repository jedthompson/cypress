var simulation_name = "Nuclear Decay";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;
simulation.description = "This demonstration illustrates how radioactive particles with a certain half-life decay over time.  As can be seen, the rate of decay at the beginning of the simulation is much larger than nearer to the end of the simulation, because there are more particles with the same chance of decaying per unit time, so more particles decay per unit time.";

simulation.init_state = function(state) {
	state.history = {};
	state.actual = {};
	state.pc = 100;
	state.hl = 30;
	state.dc = Math.LN2/state.hl;
	state.t = 0;
	state.pd = state.dc;
	state.history[state.t] = state.pc;
	state.actual[state.t] = state.pc;

	state.decayed = new Array(10);
	for (var x=0; x<10; x++) {
		state.decayed[x] = new Array(10);
		for (var y=0; y<10; y++) {
			state.decayed[x][y] = false;
		}
	}
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	state.pc = state.pc*(1-state.pd);
	count = 0;
	for (var x=0; x<10; x++) {
		for (var y=0; y<10; y++) {
			if (Math.random() < state.pd) {
				state.decayed[x][y] = true;
			} else if (!state.decayed[x][y])
				count++;
		}
	}
	state.history[state.t] = state.pc;
	state.actual[state.t] = count;

	/*if (state.t > 400) {
		state = simulation.init_state(state);
	}*/
	return state;
}

simulation.render2d = function(state, c, w, h) {
	for (var x=0; x<10; x++) {
		for (var y=0; y<10; y++) {
			if (!state.decayed[x][y]) {
				c.image(window.images["particle-red"],
					(8*x)-40, (8*y)-40, 8, 8);
			} else {
				c.image(window.images["particle-grey"],
					(8*x)-40, (8*y)-40, 8, 8);
			}
		}
	}
}

simulation.renderGraph = function(state, c, w, h) {
	c.scale(1, -1);
	c.beginPath();
	c.moveTo(-40, -40);
	c.lineTo(-40, 40);
	c.lineTo(40, 40);
	c.stroke();

	c.beginPath();
	c.moveTo(-40, 0);
	for (var t=0; t<=Math.min(state.t,400); t++) {
		c.lineTo(-40+t/5, 40-state.actual[t]*0.6);
	}
	c.stroke();

	c.strokeStyle = "#f00";
	c.lineWidth="0.2";
	c.beginPath();
	c.moveTo(-40, 0);
	for (var t=0; t<=Math.min(state.t,400); t++) {
		c.lineTo(-40+t/5, 40-state.history[t]*0.6);
	}
	c.stroke();
	c.strokeStyle = "#000";
}

simulation.addTab('Graph', simulation.renderGraph);

