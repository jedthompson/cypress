var simulation_name = "Gravity";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;
simulation.description="Gravity simulation TODO description";

function init_state(state) {
	state.settings.mass1 = 10;
	state.settings.mass2 = 3;
	state.pos1 = new Vector(0, 0);
	state.vel1 = new Vector(-.1, 0);
	state.pos2 = new Vector(0, 35);
	state.vel2 = new Vector(.25, 0);
	state.t = 0;
	return state;
}

simulation.state = init_state(simulation.state);

function dist12() {
	return dist(
		simulation.state.pos1,
		simulation.state.pos2);
}

function force12() {
	var mass1 = simulation.state.settings.mass1;
	var mass2 = simulation.state.settings.mass2;
	var pos1 = simulation.state.pos1;
	var pos2 = simulation.state.pos2;
	
	var mag = mass1*mass2/(Math.pow(dist12(),2));
	
	var xDisp = pos2.data[0]-pos1.data[0];
	var yDisp = pos2.data[1]-pos1.data[1];
	
	if(yDisp != 0 && xDisp != 0) {var phi = Math.atan(yDisp/xDisp);}
	else if(yDisp == 0) {if(xDisp > 0) {var phi = 0;} else {var phi = Math.PI;}}
	else {if(yDisp > 0) {var phi = Math.PI/2;} else {var phi = Math.PI*3/2;}}
	
	var force = new Vector(mag*Math.cos(phi), mag*Math.sin(phi));
	return force;
}

simulation.step = function(state) {
	state.t++;
	var a1 = force12().scale(1/state.settings.mass1);
	var a2 = force12().scale(-1/state.settings.mass2);

	state.vel1 = addV(state.vel1, a1.scale(simulation.dt*.01));
	state.vel2 = addV(state.vel2, a2.scale(simulation.dt*.01));
	
	state.pos1 = addV(state.pos1, state.vel1.scale(simulation.dt*.01));
	state.pos2 = addV(state.pos2, state.vel2.scale(simulation.dt*.01));
	
	var zeroVector = new Vector(0, 0, 0);
	if(state.t > 300) {state = init_state(state);}

	return state;
}
simulation.render2d = function(state, c, w, h) {
	var mass1 = simulation.state.settings.mass1;
	var mass2 = simulation.state.settings.mass2;
	var pos1 = new Vector(state.pos1.data[0], state.pos1.data[1]);
	var pos2 = new Vector(state.pos2.data[0], state.pos2.data[1]);

	var x1 = state.pos1.data[0];
	var y1 = state.pos1.data[1];
	c.beginPath();
	c.arc(x1, y1, state.settings.mass1/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();

	var x2 = state.pos2.data[0];
	var y2 = state.pos2.data[1];
	c.beginPath();
	c.arc(x2, y2, state.settings.mass2/2, 0, 2*Math.PI, false);
	c.closePath();
	c.stroke();
	
	// draw  vectors
	var a1 = force12().scale(1/mass1);
	var a2 = force12().scale(1/mass2);
	
	
	vector2dTowards(c, pos1, pos2, magV(a1)*100);
	vector2dTowards(c, pos2, pos1, magV(a2)*100);
}

