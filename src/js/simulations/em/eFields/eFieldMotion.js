var simulation_name = "Charged Particle in an electric field";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "TODO Description";
    
// Represents a field step
var Charge = function(x, y, ch) {
	this.cx = x;
	this.cy = y;
	this.charge = ch;
}

function init_state(state) {
	state.pos = new Vector(-40, 0, 0);
	state.vel = new Vector(10, 0, 0);
	state.mass = 1;
	state.charge = 100;
	state.shouldPlotPath = true;
	state.shouldPlotField = true;
	
	state.ballRad = 1;
	state.chargeRad = 1;
	
	
	state.charges = [];
	state.charges.push(new Charge(0, -10, 10));
	state.charges.push(new Charge(0, 10, -10));
	state.charges.push(new Charge(10, 0, -10));
	
	state.history = [];
	state.t = 0;
	state.history[state.t] = state.pos;
	return state;
}
simulation.state = init_state(simulation.state);

function getForce(x, y, state) {
	var force = new Vector(0, 0, 0);
	for(var i = 0; i < state.charges.length; i++) {
		var dirVect = new Vector(x-state.charges[i].cx, y-state.charges[i].cy, 0);
		var forceVect = dirVect.scale(state.charge*state.charges[i].charge/Math.pow(magV(dirVect),3));
		force = addV(force, forceVect);
	}
	return force;
}

simulation.step = function(state) {
	state.t++;
	
	var acc = getForce(state.pos.data[0], state.pos.data[1], state).scale(1/state.mass);
	state.vel = addV(state.vel, acc.scale(.001*simulation.dt));
	state.pos = addV(state.pos, state.vel.scale(.001*simulation.dt));
	state.history[state.t] = state.pos;
	
	if(state.pos.data[0] > 70 || state.pos.data[0] < -70 || state.pos.data[1] > 70 || state.pos.data[1] < -70) {
		state = init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	if(state.shouldPlotField) {
		for(var x = -50; x <= 50; x += 5) {
			for(var y = -50; y <= 50; y += 5) {
				var f = getForce(x, y, state);
				drawVector(x, y, f.scale(1/magV(f)), c);
			}
		}
	}
	if(state.shouldPlotPath) {
		drawPath(c, state.history, "#00f");
	}
	
	c.beginPath();
	c.arc(state.pos.data[0], state.pos.data[1], state.ballRad, 0, 2*Math.PI, false);
	c.strokeStyle = "#00f";
	c.stroke();
	
	for(var i = 0; i < state.charges.length; i++) {
		c.beginPath();
		c.arc(state.charges[i].cx, state.charges[i].cy, state.chargeRad, 0, 2*Math.PI, false);
		if(state.charges[i].charge > 0) {
			c.strokeStyle="#f00";
		}else if(state.charges[i].charge < 0) {
			c.strokeStyle="#000";
		}else {
			c.strokeStyle="#0f0";
		}
		c.stroke();
	}
}