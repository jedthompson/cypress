var simulation_name = "Huygen's Propagation of Wavefronts Principle";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "According to Huygen's Propagation of Wavefronts Principle, the path of a wavefront through a slit can be found by regarding every point in the slit as a light source and letting each light source release a spherical wavefront of light.  The net wavefront is then the outer edge of all the individual wavefronts.";

simulation.init_state = function(state) {
	state.xPos = [];
	state.t = 0;
	state.distBetWaves = 4; //How often a new wave is created, in units, equivalent to wavelength
	state.vel = 10; //Rate at which a wave propagates
	state.slitSize = 10;
	
	state.xPos.push(-50);
	
	state.num = 0;
	
	return state;
}
simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	if(state.xPos[state.num] >= state.distBetWaves-50) {
		state.xPos.push(-50);
		state.num++;
	}
	for(var i = 0; i <= state.num; i++) {
		state.xPos[i] += state.vel*.001*simulation.dt;
		if(state.xPos[0] >= 90) {
			state.xPos = state.xPos.slice(1);
			state.num--;
		}
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle="#000";
	for(var i = 0; i <= state.num; i++) {
		if(state.xPos[i] <= 0) {
			c.strokeStyle="#f00";
			c.beginPath();
			c.moveTo(state.xPos[i], -h/2);
			c.lineTo(state.xPos[i], h/2);
			c.stroke();
			c.strokeStyle="#000";
		} else {
			for(var j = -state.slitSize/2; j <= state.slitSize/2; j+= 2) {
				c.beginPath();
				c.arc(0, j, state.xPos[i], -Math.PI/2, Math.PI/2, false);
				c.stroke();
			}
			c.strokeStyle="#f00";
			c.beginPath();
			c.arc(0, -state.slitSize/2, state.xPos[i], -Math.PI/2, 0, false);
			//c.stroke();
			//c.beginPath();
			//c.moveTo(state.xPos[i], -state.slitSize/2-.1);
			c.lineTo(state.xPos[i], state.slitSize/2+.1);
			//c.stroke();
			//c.beginPath();
			c.arc(0, state.slitSize/2, state.xPos[i], 0, Math.PI/2, false);
			c.stroke();
			
			
			c.strokeStyle="#000";
		}
	}
	
	
	//UNCOMMENT this stuff for COLOR MODE (a bit laggy though)
	/*c.lineWidth=.6;
	for(var i = -70; i <= 100; i+=.5) {
		if(i < 0) {
			var dist = (Math.abs(i-state.xPos[0]))%state.distBetWaves;
			var phi = dist*2*Math.PI/state.distBetWaves;
			var cosine = Math.cos(phi);
			if(cosine > 0) {
				c.beginPath();
				c.moveTo(i, -h/2);
				c.lineTo(i, h/2);
				var red = Math.floor(cosine*255);
				c.strokeStyle = 'rgb(' + red + ',0,0)';
				c.stroke();
			}else {
				c.beginPath();
				c.moveTo(i, -h/2);
				c.lineTo(i, h/2);
				var blue = Math.floor(Math.abs(cosine)*255);
				c.strokeStyle = 'rgb(0,0,' + blue + ')';
				c.stroke();
			}
		} else {
			var dist = (Math.abs(i-state.xPos[0]))%state.distBetWaves;
			var phi = dist*2*Math.PI/state.distBetWaves;
			var cosine = Math.cos(phi);
			if(cosine > 0) {
				c.beginPath();
				c.arc(0, 0, i, -Math.PI/2, Math.PI/2, false);
				var red = Math.floor(cosine*255);
				c.strokeStyle = 'rgb(' + red + ',0,0)';
				c.stroke();
			}else {
			c.beginPath();
				c.arc(0, 0, i, -Math.PI/2, Math.PI/2, false);
				var blue = Math.floor(Math.abs(cosine)*255);
				c.strokeStyle = 'rgb(0,0,' + blue + ')';
				c.stroke();
			}
		}
	}
	c.lineWidth = .4;
	c.strokeStyle="0f0"/**/
	
	c.beginPath();
	c.moveTo(0, -h/2);
	c.lineTo(0, -state.slitSize/2);
	c.moveTo(0, state.slitSize/2);
	c.lineTo(0, h/2);
	c.stroke();
}
