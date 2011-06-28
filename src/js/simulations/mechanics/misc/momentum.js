var simulation_name = "Momentum";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;
simulation.description = "This simulation shows how momentum is always conserved.  Momentum, the product of the mass and velocity of an object is a vector and the net momentum (the sum of all the individual momentums of all the bodies in a system) is always conserved.";

function init_state(state) {
	state.mass1 = 5;
	state.mass2 = 2;
	state.pos1 = new Vector(-20, -5, 0);
	state.pos2 = new Vector(20, 5, 0);
	state.vel1 = new Vector(1, 0, 0);
	state.vel2 = new Vector(-1, 0, 0);
	
	//TODO Add checks to make sure values are valid
	
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	
}