// Transverse wave simulation

var simulation_name = "Wave addition, Shiva machine technique";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;   // 20 ms
simulation.description = "In this simulation, one can see how waves add.  The first two waves are independent of each other, while the bottom wave shows their sum.  If one of the waves propagates faster than the other, the waves will go through a cycle of adding constructively and destructively.";

function init_state(state) {
	state.phase1 = 0;    // initialize to zero
	state.amp1 = 10;     // initialize amplitude
	state.freq1 = 2;
	state.wavelength1 = 20;
	state.ypos1 = 30;

	state.phase2 = 0;    // initialize to zero
	state.amp2 = 10;     // initialize amplitude
	state.freq2 = 2;
	state.wavelength2 = 20;
	state.ypos2 = 0;
    
    state.ypos3 = -30;
    
    state.scale = 10.   // this "slows" things down so it looks nicer
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.phase1 += 2*Math.PI * (simulation.dt*0.001)*state.freq1/state.scale;
	state.phase2 -= 2*Math.PI * (simulation.dt*0.001)*state.freq2/state.scale;
	return state;
}

simulation.render2d = function(state, c, w, h) {

    //
    // traveling waves go like sin(kx-wt)  (or kx+wt).   think of kx as the amplitude of a vector that is 
    // transverse to the propogation direction, oscillating at +-wt
    //
    for (var i=0; i<100; i++) {
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
    for (var i=0; i<100; i++) {
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
	for (var i=0; i<100; i++) {
	   c.beginPath();
	   c.moveTo(-w/2+i, state.ypos3);
       var xphase1 = 2*Math.PI*i/state.wavelength1;
       var xphase2 = 2*Math.PI*i/state.wavelength2;
       var xamp1 = state.amp1 * Math.sin(xphase1 - state.phase1);
       var xamp2 = state.amp1 * Math.sin(xphase2 - state.phase2);
       c.lineTo(-w/2+i, state.ypos3 + xamp1 + xamp2 );
       c.strokeStyle="#000";
       c.stroke();       
	}
    
/*	c.beginPath();
	c.moveTo(-w/2, h/3 + Math.sin(state.phase+(-w/2*state.freq)/(w/16))*state.amp*h/6);
	for (i=-w/2*state.freq; i<=w/2*state.freq; i++) {
		c.lineTo(i/state.freq, h/3 + Math.sin(state.phase+i/(w/16))*state.amp*h/6);
	}
	c.strokeStyle="#f00";
	c.stroke();
	
	c.beginPath();
	c.moveTo(-w/2, Math.sin(state.phase2+(-w/2*state.freq2)/(w/16))*state.amp2*h/6);
	for (i=-w/2*state.freq2; i<=w/2*state.freq2; i++) {
		c.lineTo(i/state.freq2, Math.sin(state.phase2+i/(w/16))*state.amp2*h/6); 
	}
	c.strokeStyle="#00f";
	c.stroke();
	
	
	var j = Math.max(state.freq,state.freq2);
	c.beginPath();
	c.moveTo(-w/2, -h/3 + Math.sin(state.phase+(-w/2)*state.freq/(w/16))*state.amp*h/6 + Math.sin(state.phase2+(-w/2)*state.freq2/(w/16))*state.amp2*h/6);
	for (i=-w/2; i<=w/2; i++) {
		c.lineTo(i, -h/3 + Math.sin(state.phase+i*state.freq/(w/16))*state.amp*h/6 + Math.sin(state.phase2+i*state.freq2/(w/16))*state.amp2*h/6); 
	}
	c.strokeStyle="#000";
	c.stroke();
*/
}

