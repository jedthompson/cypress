var simulation_name = "Electric Field of a Rotating Charge";

var simulation = new Simulation(simulation_name);
simulation.dt = 30;
simulation.description = "When a charged particle rotates about some axis, its electric field generates a pulsing pattern (as long as the particle is moving at a speed comparable to the speed of light, or the speed at which the electric field propagates.)";
    
// Represents a field step
var FieldStep = function(x, y) {
	this.cx = x;
	this.cy = y;
	this.r = 0;
}

simulation.init_state = function(state) {
	state.rad = 2.5;
	state.phi = 0;
	state.angVel = Math.PI*2;
	state.fieldVel = 25;
	state.numFieldLines = 20;
	state.ballRad = 2;
	state.angleBetweenLines = 2*Math.PI/state.numFieldLines;
	state.field = [];
	
	var initStep = new FieldStep(state.rad*Math.cos(state.phi), state.rad*Math.sin(state.phi));
	
	state.field.push(initStep);
	
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.phi += state.angVel*.001*simulation.dt;
	for(var i = 0; i < state.field.length; i++) {
		state.field[i].r += state.fieldVel*.001*simulation.dt;
		if(state.field[i].r > 125) {
			state.field.shift();
		}
	}
	var nextStep = new FieldStep(state.rad*Math.cos(state.phi), state.rad*Math.sin(state.phi));
	state.field.push(nextStep);
	return state;
}

simulation.render2d = function(state, c, w, h) {
	//Draw ball
	c.beginPath();
	c.arc(state.rad*Math.cos(state.phi), state.rad*Math.sin(state.phi), state.ballRad, 0, 2*Math.PI, false);
	c.strokeStyle="#000";
	c.stroke();
	
	for(var j = 0; j < state.numFieldLines; j++) {
		c.beginPath();
		c.moveTo(state.field[0].cx+state.field[0].r*Math.cos(j*state.angleBetweenLines), state.field[0].cy + state.field[0].r*Math.sin(j*state.angleBetweenLines));
		for(var i = 1; i < state.field.length; i++) {
			c.lineTo(state.field[i].cx + state.field[i].r*Math.cos(j*state.angleBetweenLines), state.field[i].cy + state.field[i].r*Math.sin(j*state.angleBetweenLines));
		}
		c.stroke();
	}
}
