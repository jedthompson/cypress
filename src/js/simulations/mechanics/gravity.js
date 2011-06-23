var simulation_name = "Test";

var simulation = new Simulation(simulation_name);
simulation.state = {
	settings: {
		mass1: 10,
		mass2: 3,
	},
	pos1: new Vector(0, 0),
	vel1: new Vector(0, 0),
	pos2: new Vector(0, 35),
	vel2: new Vector(10, 0),
};

simulation.step = function(state) {
	return state;
}
simulation.render2d = function(state, c, w, h) {
	x = state.pos1.data[0];
	y = state.pos1.data[1];
	c.beginPath();
	c.arc(x, y, state.settings.mass1/2, 0, 2*Math.PI, false);
	c.closePath();
	c.fill();

	x = state.pos2.data[0];
	y = state.pos2.data[1];
	c.beginPath();
	c.arc(x, y, state.settings.mass2/2, 0, 2*Math.PI, false);
	c.closePath();
	c.fill();
}

