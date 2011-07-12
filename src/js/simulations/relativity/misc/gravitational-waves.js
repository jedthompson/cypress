var simulation_name = "Gravitational Waves";
var simulation = new Simulation(simulation_name);

simulation.dt = 20;

function GWave(f, r) {
	this.step = function() {
		this.r += 1;
	}
}

function init_state(state) {
	state.t = 0;
	state.p1 = new Vector(-10, 0, 0);
	state.p2 = new Vector( 10, 0, 0);

	state.waves = [];
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t += 1;

	if (state.t > 200)
		state = init_state(state);
	return state;
}

simulation.render2d = function(state, c, w, h) {
	var p1 = state.p1;
	var p2 = state.p2;
	c.fillCircle(p1.data[0], p1.data[1], 2);
	c.fillCircle(p2.data[0], p2.data[1], 2);
}

