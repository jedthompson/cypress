var simulation_name = "Simple Pendulum";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "In this demonstration of a simple pendulum, one can see how the period of the pendulum is independent of the weight of the bob and (ideally) the amplitude. (It actually does depend on the amplitude in real life because simple pendulums only approximate reality for small theta.)  The pendulum then oscillates around its equilibrium (the point where all the forces balance).";

function init_state(state) {
	state.mass = 5;
	state.penLen = 50;
	state.g = 9.8;
	state.phi = -1*Math.PI*1/3;
	state.phiInit = state.phi;
	state.topPos = new Vector(0, 40, 0);
	state.vel = new Vector(0, 0, 0);
	state.t = 0;
	
	if(state.mass <= .1) {state.mass = .1;}
	if(state.penLen <= 5) {state.penLen = 5;}
	if(state.g <= 1) {state.g = 1;}
	
	// This position is measured from topPos
	state.pos = new Vector(state.penLen*Math.cos(state.phi), state.penLen*Math.sin(state.phi), 0);
	
	//Store mechanical energy to compensate for compounded error
	state.ME = state.mass*state.g*(state.penLen+state.pos.data[1]);
	
	
	return state;
}
simulation.state = init_state(simulation.state);

function netForce(state) {
	var fG = new Vector(0, -1*state.g*state.mass, 0);
	var vTan = magV(crossV(state.pos, state.vel))/magV(state.pos);
	var netFRad = state.mass*vTan*vTan/state.penLen;
	var magFT = state.mass*state.g*Math.cos(Math.abs(state.phi-Math.PI*3/2)) + netFRad;
	var fT = new Vector(magFT*Math.sin(Math.PI*3/2-state.phi), magFT*Math.cos(Math.PI*3/2-state.phi), 0);
	var fN = addV(fG, fT);
	return fN;
}

simulation.step = function(state) {
	state.t += simulation.dt*.001;
	
	var acc = netForce(state).scale(1/state.mass);
	state.vel = addV(state.vel, acc.scale(.001*simulation.dt));
	var xPos = state.pos.data[0]+state.vel.data[0]*.001*simulation.dt;
	//var yPos = state.pos.data[1]+state.vel.data[1]*.001*simulation.dt;
	var yPos = -1*Math.sqrt((state.penLen*state.penLen)-(xPos*xPos));
	
	if(yPos != 0 && xPos != 0) {state.phi = Math.atan(yPos/xPos);}
	else if(yPos == 0) {if(xPos > 0) {state.phi = 0;} else {state.phi = Math.PI;}}
	else {if(yPos > 0) {state.phi = Math.PI*1/2;} else {state.phi = -1*Math.PI/2;}}
	
	if(state.phi > 0 && state.phi < Math.PI) {state.phi += Math.PI;}
	
	state.pos.data[0] = xPos;
	state.pos.data[1] = yPos;
	
	//Error compensation
	var U = state.mass*state.g*(state.penLen+state.pos.data[1]);
	var KE = state.mass*Math.pow(magV(state.vel), 2)/2;
	//Check to see if potential energy is too large
	if(U > state.ME) {
		var newU = state.ME;
		var newY = newU/(state.mass*state.g)-state.penLen;
		state.pos.data[1] = newY;
		var newX = Math.abs(state.penLen*Math.cos(state.phiInit));
		if(state.pos.data[0] > 0) {
			state.pos.data[0] = newX;
		} else {
			state.pos.data[0] = -1*newX;
		}
		state.vel = new Vector(0, 0, 0);
		if(yPos != 0 && xPos != 0) {state.phi = Math.atan(yPos/xPos);}
		else if(yPos == 0) {if(xPos > 0) {state.phi = 0;} else {state.phi = Math.PI;}}
		else {if(yPos > 0) {state.phi = Math.PI*1/2;} else {state.phi = -1*Math.PI/2;}}
	
		if(state.phi > 0 && state.phi < Math.PI) {state.phi += Math.PI;}
	} else if(U+KE != state.ME){
		//Get the unit vector of velocity
		var velUnit = state.vel.scale(1/magV(state.vel));
		
		var newKE = state.ME-U;
		var newVMag = Math.pow(2*newKE/(state.mass), .5);
		state.vel = velUnit.scale(newVMag);
	}
	
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	//vector2dAtAngle(state.topPos.data[0], -1*state.topPos.data[1], state.penLen, (state.phi*180/Math.PI), c, "#000");
	var topPosition = new Vector(state.topPos.data[0], state.topPos.data[1]);
	var position = new Vector(state.topPos.data[0] + state.pos.data[0], (state.topPos.data[1] + state.pos.data[1]));
	c.beginPath();
	c.moveTo(topPosition.data[0], topPosition.data[1]);
	c.lineTo(position.data[0], position.data[1]);
	c.closePath();
	c.strokeStyle="#000";
	c.stroke();
	drawVector(position.data[0], position.data[1], state.vel.scale(1), c, "#000");
	c.image(window.images["particle-red"], position.data[0]-4, position.data[1]-4, 8, 8);
	//vector2dTowards(c, topPosition, position, state.penLen);
}
