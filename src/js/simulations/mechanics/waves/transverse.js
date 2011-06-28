// Transverse wave simulation

var simulation_name = "Transverse Waves";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Transverse waves simulation TODO description";

function init_state(state) {
	state.phase = 0;
	state.amp = 0.6;
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.phase += 0.01; // TODO don't hard-code this
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.beginPath();
	c.moveTo(-w/2, 0);
	for (i=-w/2; i<=w/2; i++) {
		c.lineTo(i, Math.sin(state.phase+i/(w/16))*state.amp*h/2); 
	}
	c.stroke();
}
