// Longitudinal wave simulation

var simulation_name = "Longitudinal Waves";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Longitudinal waves simulation TODO description";

function init_state(state) {
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {

}

