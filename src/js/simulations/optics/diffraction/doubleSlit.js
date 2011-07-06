var simulation_name = "Double Slit Diffraction";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "As shown in the famous Young experiment, light behaves like a wave in that it diffracts.  This means that when passed through two slits, collated light will create an interference pattern.";

function init_state(state) {
	state.xPos = [];
	state.t = 0;
	state.distBetWaves = 5; //How often a new wave is created, in units, equivalent to wavelength
	state.vel = 10; //Rate at which a wave propagates
	state.distBetSlits = 10;
	
	
	state.xPos.push(-50);
	
	state.num = 0;
	
	state.colorTable = [];
	
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
		if(state.xPos[0] >= 70) {
			state.xPos = state.xPos.slice(1);
			state.num--;
		}
	}
	
	
	if(state.t == 1) {
		var h = simulation.getHeight();
		var w = simulation.getWidth();
	
		for(var i = -h/2; i <= h/2; i += .3) {
			var dist1 = Math.sqrt(Math.pow(i-state.distBetSlits/2, 2) + 1600);
			var dist2 = Math.sqrt(Math.pow(i+state.distBetSlits/2, 2) + 1600);
			var diff = Math.abs(dist1%state.distBetWaves - dist2%state.distBetWaves);
			var phi = diff*Math.PI/state.distBetWaves;
			var cosine = Math.abs(Math.cos(phi));
			
			/*c.beginPath();
			c.moveTo(40, i);
			c.lineTo(45, i);*/
			var color = Math.floor(cosine*255);
			var strokeStyle = 'rgb(' + color + ',0,0)';
			state.colorTable[i] = strokeStyle;
			/*c.stroke();*/
		}
	}
	
	
	
	
	return state;
}

simulation.render2d = function(state, c, w, h) {
	c.strokeStyle='rgba(255,0,0,0.5)';
	for(var i = 0; i <= state.num; i++) {
		if(state.xPos[i] <= 0) {
			c.beginPath();
			c.moveTo(state.xPos[i], -h/2);
			c.lineTo(state.xPos[i], h/2);
			c.stroke();
		} else {
			c.beginPath();
			c.arc(0, -state.distBetSlits/2, state.xPos[i], -Math.PI/2, Math.PI/2, false);
			c.stroke();
			c.beginPath();
			c.arc(0, state.distBetSlits/2, state.xPos[i], -Math.PI/2, Math.PI/2, false);
			c.stroke();
		}
	}
	c.fillStyle="#fff";
	c.fillRect(40, -h/2, w-90, h);
	c.beginPath();
	c.moveTo(40, -h/2);
	c.lineTo(40, h/2);
	c.strokeStyle="#000";
	c.stroke();
	
	for(var i = -h/2; i <= h/2; i += .3) {
		c.beginPath();
		c.moveTo(40, i);
		c.lineTo(45, i);
		c.strokeStyle = state.colorTable[i];
		c.stroke();
	}
	
	//c.fillStyle="#fff";
	//c.fillRect(-.3, -h/2, .6, h);

	
	c.beginPath();
	c.moveTo(0, -h/2);
	c.lineTo(0, -5.5);
	c.moveTo(0, -4.5);
	c.lineTo(0, 4.5);
	c.moveTo(0, 5.5);
	c.lineTo(0, h/2);
	c.strokeStyle = "#000";
	c.stroke();
}
