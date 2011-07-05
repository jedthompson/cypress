var simulation_name = "Cycloid";
var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "A cycloid is the curve traced out by a point on the edge of a rolling cylinder.  Here, one can see the cycloid traced out when a cylinder of arbitrary radius rolls without slipping along a plane.";

function init_state(state) {
	state.phi = 0;
	state.ballVel = new Vector(10, 0, 0);
	state.ballPos = new Vector(-40, 0, 0);
	state.ballRad = 5;
	state.t = 0;
	
	state.omega = magV(state.ballVel)/state.ballRad; //Angular velocity
	if(state.ballVel.data[0] > 0) {
		state.omega = -state.omega;
	}
	
	state.history = [];
	state.history[state.t] = new Vector(state.ballPos.data[0]+state.ballRad*Math.cos(state.phi), state.ballPos.data[1]+state.ballRad*Math.sin(state.phi));
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	state.phi += state.omega*.001*simulation.dt;
	state.ballPos = addV(state.ballPos, state.ballVel.scale(.001*simulation.dt));
	
	state.history[state.t] = new Vector(state.ballPos.data[0]+state.ballRad*Math.cos(state.phi), state.ballPos.data[1]+state.ballRad*Math.sin(state.phi));
	
	if(state.ballPos.data[0] > simulation.getWidth()/2+10) {
		state = init_state(state);
	}
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.beginPath();
	c.moveTo(-w/2, state.ballPos.data[1]-state.ballRad);
	c.lineTo(w/2, state.ballPos.data[1]-state.ballRad);
	c.strokeStyle="#000";
	c.stroke();
	
	c.beginPath();
	c.arc(state.ballPos.data[0], state.ballPos.data[1], state.ballRad, 0, 2*Math.PI, false);
	c.stroke();
	
	c.beginPath();
	c.arc(state.history[state.t].data[0], state.history[state.t].data[1], 1, 0, 2*Math.PI, false);
	c.stroke();
	
	drawPath(c, state.history);
}
