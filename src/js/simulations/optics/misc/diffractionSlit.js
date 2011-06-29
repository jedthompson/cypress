var simulation_name = "Diffraction Through a Slit";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "TODO Description";

function init_state(state) {
	state.xPos = {};
	state.t = 0;
	state.distBetWaves = 5; //How often a new wave is created, in units
	
	state.xPos
	
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	return state;
}

simulation.render2d = function(state, c, w, h) {
	
}
