var simulation_name = "Charged Particle in a Magnetic Field";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "When a moving particle with an electric charge is subjected to a magnetic field, it accelerates in the direction of the cross product of the particles velocity and the magnetic field.  Thus if the particle is moving perpendicular to a constant magnetic field, it will curve in a circular path.";

function init_state(state) {
	//Some of these are state values because they pertain directly to the state and might be used in another tab
	state.vel = new Vector(0, 10, 0);
	state.charge = 1;
	state.mass = 3;
	state.BField = new Vector(0, 0, 1);
	
	//Establish base values to avoid dividing by zero and to avoid variables too small to see the motion
	if(state.mass <= 1) {state.mass = 1;}
	if(magV(state.BField) <= 1) {state.BField = new Vector(0, 0, 1);}
	if(Math.abs(state.charge) < 1) {state.charge = 1;}
	
	//Calculate radius of rotation
	state.radRot = Math.abs(state.mass)*magV(state.vel)/(Math.abs(state.charge)*magV(state.BField));
	
	//Calculate acceleration
	var acc = (crossV(state.vel, state.BField)).scale(state.charge/state.mass);
	
	//Calculate angle to initial position assuming center of rotation is at center (0, 0)
	if(acc.data[1] != 0 && acc.data[0] != 0) {var phiInit = Math.PI+Math.atan((acc).data[1]/(acc).data[0]);}
	else if(acc.data[1] == 0) {if(acc.data[0] > 0) {var phiInit = Math.PI;} else {var phiInit = 0;}}
	else {if(acc.data[1] > 0) {var phiInit = Math.PI*3/2;} else {var phiInit = Math.PI/2;}}
	
	//Set current angular position to initial angular position
	state.phi = phiInit;
	
	//Calculate current position based on current angular position
	state.pos = new Vector((state.radRot*Math.cos(phiInit)), (state.radRot*Math.sin(phiInit)), 0);
	
	//Check whether rotation is in a positive or negative direction and set phiStep accordingly
	if(crossV(state.pos, state.vel).data[2] > 0) {state.phiStep = .001*simulation.dt;} else {state.phiStep = -.001*simulation.dt;}
		
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.phi += state.phiStep;
	state.pos = new Vector((state.radRot*Math.cos(state.phi)), (state.radRot*Math.sin(state.phi)));
	
	//TODO Increment velocity as well as position for use in another tab
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	vector2dAtAngle(state.pos.data[0], -1*state.pos.data[1], state.radRot, 180+(state.phi*180/Math.PI), c);
	
	//The '-1' is used to convert the cartesian coordinate system to the actual coordinate system used to display graphics
	c.drawImage(window.images["particle-red"], state.pos.data[0]-4, -1*state.pos.data[1]-4, 8, 8);
}