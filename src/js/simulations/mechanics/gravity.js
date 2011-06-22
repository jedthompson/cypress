var simulation_name = "Test";

var simulation = new Simulation(simulation_name);
simulation.state = 0;
simulation.step = function(settings, state) {
	return state+1;
}
simulation.render2d = function(state, c, w, h) {
	c.fillRect(0, 0, state, h);
}

