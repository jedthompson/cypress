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

function dist12() {
	return dist(
		simulation.state.pos1,
		simulation.state.pos2);
}

function force12() {
	mass1 = simulation.state.settings.mass1;
	mass2 = simulation.state.settings.mass2;
	pos1 = simulation.state.pos1;
	pos2 = simulation.state.pos2;
	return mass1*mass2/(Math.pow(dist12(),2))
}

simulation.step = function(state) {
	a1 = force12()/mass1;
	a2 = force12()/mass2;

	state.vel1 += a1;
	state.vel2 += a2;

	return state;
}
simulation.render2d = function(state, c, w, h) {
	mass1 = simulation.state.settings.mass1;
	mass2 = simulation.state.settings.mass2;
	pos1 = simulation.state.pos1;
	pos2 = simulation.state.pos2;

	x = state.pos1.data[0];
	y = state.pos1.data[1];
	c.beginPath();
	c.arc(x, y, state.settings.mass1/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();

	x = state.pos2.data[0];
	y = state.pos2.data[1];
	c.beginPath();
	c.arc(x, y, state.settings.mass2/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	// draw  vectors
	a1 = force12()/mass1;
	a2 = force12()/mass2;
	vector2dTowards(c, state.pos1, state.pos2, a1*1000);
	vector2dTowards(c, state.pos2, state.pos1, a2*1000);
}

