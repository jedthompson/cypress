// Longitudinal wave simulation

var simulation_name = "Longitudinal Waves";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Longitudinal waves occur when a spring or some other compressible material (the ground, the air, etc.) is rapidly compressed and decompressed.  This causes sound, earthquakes, and many other effects.";

simulation.init_state = function(state) {
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {

}

