// Transverse wave simulation

var simulation_name = "Transverse Waves";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Transverse waves simulation TODO description";

function init_state(state) {
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {

}

