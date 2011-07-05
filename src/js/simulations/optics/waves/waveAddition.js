// Transverse wave simulation

var simulation_name = "Wave addition";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "TODO Description";

function init_state(state) {
	state.phase = 0;
	state.amp = 0.4;
	state.phase2 = Math.PI/3;
	state.amp2 = 0.4;
	state.freq = 2;
	state.freq2 = Math.PI/8;
	state.propSpeed = 10;
	state.propSpeed2 = 15;
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.phase += state.propSpeed*.001*state.freq;
	state.phase2 += state.propSpeed2*.001*state.freq2;
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.beginPath();
	c.moveTo(-w/2, h/3 + Math.sin(state.phase+(-w/2*state.freq)/(w/16))*state.amp*h/6);
	for (i=-w/2*state.freq; i<=w/2*state.freq; i++) {
		c.lineTo(i/state.freq, h/3 + Math.sin(state.phase+i/(w/16))*state.amp*h/6);
	}
	c.strokeStyle="#f00";
	c.stroke();
	
	c.beginPath();
	c.moveTo(-w/2, Math.sin(state.phase2+(-w/2*state.freq)/(w/16))*state.amp2*h/6);
	for (i=-w/2*state.freq2; i<=w/2*state.freq2; i++) {
		c.lineTo(i/state.freq2, Math.sin(state.phase2+i/(w/16))*state.amp2*h/6); 
	}
	c.strokeStyle="#00f";
	c.stroke();
	
	
	var j = Math.max(state.freq,state.freq2);
	c.beginPath();
	c.moveTo(-w/2, -h/3 + Math.sin(state.phase+(-w/2*j)/(w/16))*state.amp*h/6);
	for (i=-w/2; i<=w/2; i++) {
		c.lineTo(i, -h/3 + Math.sin(state.phase+i*state.freq/(w/16))*state.amp*h/6 + Math.sin(state.phase2+i*state.freq2/(w/16))*state.amp2*h/6); 
	}
	c.strokeStyle="#000";
	c.stroke();
}

