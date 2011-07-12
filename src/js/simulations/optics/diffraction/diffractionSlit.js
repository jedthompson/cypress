var simulation_name = "Diffraction Through a Slit";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "Because light has wave-like qualities, when it passes through a thin slit, it diffracts in a radial pattern away from the slit.";

function init_state(state) {
	state.xPos = [];
	state.t = 0;
	state.distBetWaves = 5; //How often a new wave is created, in units
	state.vel = 10; //Rate at which a wave propagates
	
	state.xPos.push(-50);
	
	state.num = 0;
	
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t++;
	if(state.xPos[state.num] >= state.distBetWaves-50) {
		state.xPos.push(-50);
		state.num++;
	}
	for(var i = 0; i <= state.num; i++) {
		state.xPos[i] += state.vel*.001*simulation.dt;
		if(state.xPos[0] >= 150) {
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
			c.beginPath();
			c.moveTo(state.xPos[i], -h/2);
			c.lineTo(state.xPos[i], h/2);
			c.stroke();
		} else {
			c.beginPath();
			c.arc(0, 0, state.xPos[i], -Math.PI/2, Math.PI/2, false);
			c.stroke();
		}
	}
	
	//UNCOMMENT this stuff for COLOR MODE (a bit laggy though)
	/*for(var i = -70; i <= 100; i+=.5) {
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
	c.lineTo(0, -.5);
	c.moveTo(0, .5);
	c.lineTo(0, h/2);
	c.stroke();
}
