var simulation_name = "Fourier Synthesis";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
desString = "Fourier sythesis....";
simulation.description = desString;
debug = true;
ifirst = true;
DBG.enabled = false;
first = true;
nsines = 30;
var temp = null;

simulation.init_state = function(state) {
	state.cur = false;
	state.path = [];
	state.period = state["period"];
	//
	// these arrays are vectors.   [0/1]=x/y coordinate to grab, [2]=amp, [3]=display value
	//
	//
	// square wave?
	//
	if (state.doSquare) {
		state.ampl = state.hScale*4/Math.PI;
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i=i+2 ) state.sinAmp[i].data[2] = 1/i;
	}
	if (state.doTriangle) {
		state.ampl = state.hScale*8/(Math.PI*Math.PI);
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i=i+2 ) {
			var powe = .5*(i-1);
			var nume = Math.pow(-1,powe);
			state.sinAmp[i].data[2] = nume/(i*i);
		}
	}
	if (state.doSawtooth) {
		state.ampl = state.hScale/Math.PI;
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		state.cosAmp[0].data[2] = .5*Math.PI;
		for (var i=1; i<nsines; i++ ) state.sinAmp[i].data[2] = 1/i;
	}
	if (state.pleaseZero) {
		for (var i=0; i<nsines; i++) {
			state.sinAmp[i].data[2] = 0;
			state.cosAmp[i].data[2] = 0;
		}
		state.pleaseZero = false;
	}
	return state;
}

//
// square wave with wavelength 2L, amplitude 1:
//
// f(x) = (4/pi) sum(1,3,5...odd) (1/n)sin(n*pi*x/L)
//
// so the fourier amplitudes for sin are 1, 0, 1/3, 0, 1/5, 0, 1/7, 0....
//
function bfunction(d) {
//	if (d) alert("pushed");
}

simulation.setup = function(state) {
	//
	state.doSquare = true;
	state.doTriangle = false;
	state.doSawtooth = false;
	state.pleaseSwap = false;
	state.pleaseZero = false;
	var buttonX0 = -100;
	var buttonY0 = 20;
	var buttonX1 = 0;
	var buttonY1 = 40;
	var buttonX2 = 0;
	var buttonY2 = 20;
	var buttonX3 = 0;
	var buttonY3 = 0;
	var buttonX4 = -100;
	var buttonY4 = 0;
	var buttonX5 = -100;
	var buttonY5 = -20;
	var buttonW = 70;
	var buttonH = 10;
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Button(buttonX0,buttonY0,buttonW,buttonH,
		temp, bfunction, "Reset Amplitudes");
	state.settingsWidgets[1] = new Button(buttonX1,buttonY1,buttonW,buttonH,
		temp, bfunction, "Square Wave");
	state.settingsWidgets[2] = new Button(buttonX2,buttonY2,buttonW,buttonH,
		temp, bfunction, "Triangle Wave");
	state.settingsWidgets[3] = new Button(buttonX3,buttonY3,buttonW,buttonH,
		temp, bfunction, "Sawtooth Wave");
	state.settingsWidgets[4] = new Button(buttonX4,buttonY4,buttonW,buttonH,
		temp, bfunction, "Swap Sin/Cos");
	state.settingsWidgets[5] = new Button(buttonX5,buttonY5,buttonW,buttonH,
		temp, bfunction, "Set All=0");

//	state.hScale = 20;   // length of amplitude on the canvas if amp=1
	state.hScale = 40;   // length of amplitude on the canvas if amp=1
	state.x0 = 0;  // coord for amplitudes filled in render2d once we know the width 
	state.x1 = 1;  // ditto
	state.y0sin = 0; // ditto
	state.y0cos = 0; // ditto
	state["period"] = 15;
	state.settingsWidgets[6] = new Slider(buttonX0, 35, 60, 6, "period", 1, 40,"Wavelength");
	state.sinAmp = [];
	state.cosAmp = [];
	state.npoints = 200;
	state.x1plot = 10;
	state.x2plot = 0;

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);

	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		state.period = state["period"];
		//
		// see if we've pushed the button 
		//
		var resetAmps = (x > buttonX0) && (x < buttonX0+buttonW) && 
			(y > buttonY0-buttonH/2) && (y < buttonY0+buttonH/2);
		if (resetAmps) 	state = simulation.init_state(simulation.state);
		//
		// which waveform to synthesize?
		//
		var pleaseSquare = (x > buttonX1) && (x < buttonX1+buttonW) && 
			(y > buttonY1-buttonH/2) && (y < buttonY1+buttonH/2);
		var pleaseTriangle = (x > buttonX2) && (x < buttonX2+buttonW) && 
			(y > buttonY2-buttonH/2) && (y < buttonY2+buttonH/2);
		var pleaseSawtooth = (x > buttonX3) && (x < buttonX3+buttonW) && 
			(y > buttonY3-buttonH/2) && (y < buttonY3+buttonH/2);
		
		if (pleaseSquare) {
			state.doSquare = true;
			state.doTriangle = false;
			state.doSawtooth = false;
			state = simulation.init_state(simulation.state);
		}
		if (pleaseTriangle) {
			state.doSquare = false;
			state.doTriangle = true;
			state.doSawtooth = false;
			state = simulation.init_state(simulation.state);
		}
		if (pleaseSawtooth) {
			state.doSquare = false;
			state.doTriangle = false;
			state.doSawtooth = true;
			state = simulation.init_state(simulation.state);
		}
		//
		// swap?  (just for fun)
		//
		state.pleaseSwap = (x > buttonX4) && (x < buttonX4+buttonW) && 
			(y > buttonY4-buttonH/2) && (y < buttonY4+buttonH/2);
		if (state.pleaseSwap) {
			for (var i=0; i<nsines; i++) {
				var tamp = state.sinAmp[i].data[2];
				state.sinAmp[i].data[2] = state.cosAmp[i].data[2];
				state.cosAmp[i].data[2] = tamp;
			}
			state.pleaseSwap = false;
		}
		//
		// set all to zero?  (just for fun)
		//
		state.pleaseZero = (x > buttonX5) && (x < buttonX5+buttonW) && 
			(y > buttonY5-buttonH/2) && (y < buttonY5+buttonH/2);
		if (state.pleaseZero) {
			state.doSquare = false;
			state.doTriangle = false;
			state.doSawtooth = false;
			state = simulation.init_state(simulation.state);
		}
		//
		return state;
	}
	state = simulation.init_state(simulation.state);
	return state;
}


simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {
	state.x0 = -w/2 + 15;
	state.x1 = -10;
//	state.y0sin = -h/4 + 15;
	state.y0sin = 5;
	state.y0cos = -h/2 + 5;
	state.x2plot = w/2-10;
	//
	// draw the horizontal to divide into 2.  right panel will have the wave,left will have the
	// fourier components
	//
	c.lineWidth = .1;
	c.beginPath();
	c.moveTo(0,-h/2);
	c.lineTo(0,h/2);
	c.stroke();
	c.moveTo(-w/2,-h/2);
	c.lineTo(w/2,-h/2);
	c.stroke();
	//
	// draw the sine and cosine amplitudes.
	// sines go on the top, cosines on the bottom, of the lower panel
	//
	// 
	//
	var deltax = (state.x1 - state.x0)/nsines;
	var x = state.x0;
	var y = state.y0sin;
	c.text("Sines",-w/2+1,y-1);
	for (var i=0; i<nsines; i++) {
		var amp = state.sinAmp[i].data[2]*state.hScale;
		drawAmp(c, new Vector(x,y), new Vector(x,y+amp) );
		c.text(i,x-1,y-3);
		state.sinAmp[i].data[0] = x;
		var yc = y+amp;
		state.sinAmp[i].data[1] = yc;
		if (state.sinAmp[i].data[3]) c.text(round(state.sinAmp[state.isel].data[2],2),
				state.sinAmp[state.isel].data[0],state.y0sin+state.hScale+2);
		if (first) DBG.write("sin["+i+"] x/y="+round(x,1)+"/"+round(yc,1));
		x = x + deltax;
	}
	var x = state.x0;
	var y = state.y0cos;
	c.text("Cosines",-w/2+1,y-1);
	for (var i=0; i<nsines; i++) {
		var amp = state.cosAmp[i].data[2]*state.hScale;
		drawAmp(c, new Vector(x,y), new Vector(x,y+amp) );
		c.text(i,x-1,y-3);
		state.cosAmp[i].data[0] = x;
		var yc = y+amp;
		state.cosAmp[i].data[1] = yc;
		x = x + deltax;
	}
	//
	// if something is changing, report it...
	//
	if (state.cur) {
		if (issine) {
			if (state.isel > -1) c.text(round(state.sinAmp[state.isel].data[2],3),
				state.sinAmp[state.isel].data[0],state.y0sin+state.hScale+2);
		}
		else {
			if (state.isel > -1) c.text(round(state.cosAmp[state.isel].data[2],3),
				state.cosAmp[state.isel].data[0],state.y0cos+state.hScale+2);
		}
	}
	//
	// draw the waveform
	//
	var dx = (state.x2plot-state.x1plot)/state.npoints;
	var x = 0;
	path = [];
	if (first) DBG.write("amp "+round(state.ampl,1)+" period "+state.period+" nsines "+nsines);
	var y = 0;
	for (var n=0; n<state.npoints; n++) {
		y = 0;
		var xcenter = x + .5*dx;
		for (var i=0; i<nsines; i++) {
			var phase = i*Math.PI*xcenter/state.period;
			if (ifirst) DBG.write("i="+i+" phase="+round(phase,2)+" sinAmp="+round(state.sinAmp[i].data[2],2));
			var ysin = state.sinAmp[i].data[2]*Math.sin(phase);
			var ycos = state.cosAmp[i].data[2]*Math.cos(phase);
			y += ysin + ycos;
		}
		ifirst = false;
		y = .5*y*state.ampl;
		state.path[n] = new Vector(state.x1plot+xcenter,y);
//		if (first) DBG.write("n="+n+" x/y= "+round(x,2)+"/"+round(y,2));
		x += dx;
	}
	drawPath(c, state.path, "#00f");
	first = false;

}

function drawAmp(c, start, end) {
	c.beginPath();
	c.arc(start.data[0],start.data[1],.5,2.*Math.PI,0,false);
	c.stroke();
	c.moveTo(start.data[0], start.data[1]);
	c.lineTo(end.data[0], end.data[1]);
	c.stroke();
	c.moveTo(end.data[0]-1,end.data[1]);
	c.lineTo(end.data[0]+1,end.data[1]);
	c.stroke();
	c.closePath();
}



// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}


simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	state.cur = false;
	state.isel = -1;
	var issine = true;
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	//
	// mouse is down, so choose which amplitude we are dealing with
	//
	// see if we are changing the amplitude by dragging.  use the coordinate in 
	// state.sinAmp and state.cosAMP data[0]=x and data[1]=y within +- 1 in x and y
	//
	var dr = 2;
	var xcoord = x/2;
	var ycoord = (y+50)/2;
	DBG.write("Mousedown x="+round(xcoord,1)+" y="+round(ycoord,1));
	for (var i=0; i<nsines; i++) {
		xamps = state.sinAmp[i].data[0] - xcoord;
		yamps = state.sinAmp[i].data[1] - ycoord;
		var rs = Math.sqrt( xamps*xamps + yamps*yamps);
		xampc = state.cosAmp[i].data[0] - xcoord;
		yampc = state.cosAmp[i].data[1] - ycoord;
		var rc = Math.sqrt( xampc*xampc + yampc*yampc);
		if ( rs < 2 ) {
			state.isel = i;
			issine = true;
			state.cur = true;
			DBG.write("Found it! sin wave amplitude isel="+state.isel);
			return state;
		}
		else if ( rc < 2 ) {
			state.isel = i;
			issine = false;
			state.cur = true;
			DBG.write("Found it! cos wave amplitude isel="+state.isel);
			return state;
		}
	}
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	var xcoord = x/2;
	var ycoord = (y+50)/2;
	if (state.cur) {
		//
		// if isel = -1, error!!!
		//
		if (state.isel < 0) alert("Something went wrong");
		//
		// check if sin or cos, get the coordinate, subtract the offset, rescale using the
		// height, and reset the amplitude accordingly 
		//
		if (issine) {
			var deltaH = ycoord - state.y0sin;
			state.sinAmp[state.isel].data[2] = deltaH/state.hScale;
			DBG.write(" Rescaling sin amplitude to "+state.sinAmp[state.isel].data[2]);
		}
		else {
			var deltaH = ycoord - state.y0cos;
			state.cosAmp[state.isel].data[2] = deltaH/state.hScale;
		}
	}
	return state;
}
