var simulation_name="Doppler Effect";
var simulation = new Simulation(simulation_name);
simulation.dt = 35;
simulation.description = "When a moving particle emits spherical waves, the waves undergo the Doppler effect.  This causes them to shift in frequency in front of and behind the particle.  This effect can be easily observed in reality when a sound source of constant frequency passes a stationary observer.";

// Represents a circular wave
var Wave = function(x, y) {
	this.cx = x;
	this.cy = y;
	this.r = 0;
}

simulation.init_state = function(state) {
	state.waves = new Array();
	state.timeSinceWave = 0;
	state.freq = 10;
	state.waveSpeed = 0.4;
	state.speed = 0.2;
	state.y = 0;
	state.x = -45;
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.x += state.speed;
	if (state.x > 55)
		return simulation.init_state(state);

	state.timeSinceWave++;
	if (state.timeSinceWave >= state.freq) {
		state.timeSinceWave = 0;
		state.waves.push(new Wave(state.x, state.y));
	}

	for (var i=0; i<state.waves.length; i++) {
		state.waves[i].r += state.waveSpeed;
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	// draw the emitter
	c.beginPath();
	c.arc(state.x, state.y, 1.5, 0, 2*Math.PI, false);
	c.stroke();
	c.fill();

	var waves = state.waves;
	for (var i=0; i<waves.length; i++) {
		c.beginPath();
		c.arc(waves[i].cx, waves[i].cy, waves[i].r, -1, 2*Math.PI, false);
		c.strokeStyle = "rgba(0, 0, 0, 0.35)";
		c.stroke();
	}
}

simulation.renderSettings = function(state, c, w, h) {
}

simulation.renderSettings.widgets = [

];

