// Transverse wave simulation

var simulation_name = "Wave addition, Shiva machine technique";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;   // 20 ms
simulation.description = "In this simulation, one can see how waves add.  The first two waves are independent of each other, while the bottom wave shows their sum.  If one of the waves propagates faster than the other, the waves will go through a cycle of adding constructively and destructively.";

simulation.init_state = function(state) {
	state.phase1 = 0;    // initialize to zero
	state.amp1 = 10;     // initialize amplitude
	state.vel1 = 4;
	state.wavelength1 = 20;
	state.ypos1 = 30;

	state.phase2 = 0;    // initialize to zero
	state.amp2 = 10;     // initialize amplitude
	state.vel2 = -4;
	state.wavelength2 = 20;
	state.ypos2 = 0;
    
    state.ypos3 = -30;
    
    state.scale = 10.   // this "slows" things down so it looks nicer
	return state;
}

//
// Set up the widgets.  Here we make a slider to vary the index of refraction in the 2nd region
//
simulation.setup = function(state) {
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Slider(-40, 40, 60, 4, "vel1", 0, 10, "Velocity 1");
	state.settingsWidgets[1] = new Slider(-40, 20, 60, 4, "wavelength1", 10, 50, "Wavelength 1");
	state.settingsWidgets[2] = new Slider(-40, 0, 60, 4, "amp1", 1, 50, "Amplitude 1");
	state.settingsWidgets[3] = new Slider(40, 40, 60, 4, "vel2", -10, 0, "Velocity 2");
	state.settingsWidgets[4] = new Slider(40, 20, 60, 4, "wavelength2", 10, 50, "Wavelength 2");
	state.settingsWidgets[5] = new Slider(40, 0, 60, 4, "amp2", 1, 50, "Amplitude 2");
	
	
	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	state = simulation.init_state(simulation.state);
	return state;
}

//simulation.state = simulation.init_state(simulation.state);

simulation.step = function(state) {
	state.phase1 += 2*Math.PI * (simulation.dt*0.001)*state.vel1/state.wavelength1;
	state.phase2 += 2*Math.PI * (simulation.dt*0.001)*state.vel2/state.wavelength2;
	return state;
}

simulation.render2d = function(state, c, w, h) {

    //
    // traveling waves go like sin(kx-wt)  (or kx+wt).   think of kx as the amplitude of a vector that is 
    // transverse to the propogation direction, oscillating at +-wt
    //
    for (var i=0; i<w; i++) {
       c.beginPath();
       c.moveTo(-w/2+i, state.ypos1);
       var xphase = 2*Math.PI*i/state.wavelength1;
       c.lineTo(-w/2+i, state.ypos1 + state.amp1 * Math.sin(xphase - state.phase1) );
       c.strokeStyle="#000";
       c.stroke();
    }
    //
    // now do the next wave.  notice that in simulation.step, the velocity is negative
    //
    for (var i=0; i<w; i++) {
       c.beginPath();
       c.moveTo(-w/2+i, state.ypos2);
       var xphase = 2*Math.PI*i/state.wavelength2;
       c.lineTo(-w/2+i, state.ypos2 + state.amp2 * Math.sin(xphase - state.phase2) );
       c.strokeStyle="#000";
       c.stroke();
    }
	//
	// now add them both together to see what you get
	//
	for (var i=0; i<w; i++) {
	   c.beginPath();
	   c.moveTo(-w/2+i, state.ypos3);
       var xphase1 = 2*Math.PI*i/state.wavelength1;
       var xphase2 = 2*Math.PI*i/state.wavelength2;
       var xamp1 = state.amp1 * Math.sin(xphase1 - state.phase1);
       var xamp2 = state.amp1 * Math.sin(xphase2 - state.phase2);
       c.lineTo(-w/2+i, state.ypos3 + xamp1 + xamp2 );
       c.strokeStyle="#00f";
       c.stroke();       
	}
    
}

// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
//	renderWidgets(state.sliderv, c, state);
//	renderWidgets(state.sliderl, c, state);
}

