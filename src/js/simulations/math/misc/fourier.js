var simulation_name = "Thin Lens";

var simulation = new Simulation(simulation_name);
simulation.dt = 100;
desString = "Fourier sythesis....";
simulation.description = desString;
debug = true;
ifirst = true;
DBG.enabled = false;
first = true;
nsines = 20;
var temp = null;

simulation.init_state = function(state) {
	state.cur = false;
	state.path = [];
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
	var buttonX = -200;
	var buttonY = 20;
	var buttonW= 50;
	var buttonH = 10;
/*	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Button(buttonX,buttonY,buttonW,buttonH,
		temp, bfunction, "Toggle Sign");

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
*/
	state.hScale = 20;   // length of amplitude on the canvas if amp=1
	state.x0 = 0;  // coord for amplitudes filled in render2d once we know the width 
	state.x1 = 1;  // ditto
	state.y0sin = 0; // ditto
	state.y0cos = 0; // ditto
	state.sinAmp = [];
	state.cosAmp = [];
	state.period = 8;
	state.npoints = 200;
	state.x1plot = 10;
	state.x2plot = 0;
	//
	// these arrays are vectors.   [0/1]=x/y coordinate to grab, [2]=amp
	//
	for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0);
	for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0);
	//
	// square wave?
	//
	for (var i=1; i<nsines; i=i+2 ) state.sinAmp[i].data[2] = 1/i;
	//
	state = simulation.init_state(simulation.state);
	return state;
}


simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {
	state.x0 = -w/2 + 10;
	state.x1 = -10;
	state.y0sin = -h/4 + 5;
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
	// go from 0 to w/2 - 10 pixels.   so divide w/2-10 by nsines to get delta 
	//
	var deltax = (state.x1 - state.x0)/nsines;
	var x = state.x0;
	var y = state.y0sin;
	for (var i=0; i<nsines; i++) {
		var amp = state.sinAmp[i].data[2]*state.hScale;
		drawAmp(c, new Vector(x,y), new Vector(x,y+amp) );
		state.sinAmp[i].data[0] = x;
		var yc = y+amp;
		state.sinAmp[i].data[1] = yc;
		if (first) DBG.write("sin["+i+"] x/y="+round(x,1)+"/"+round(yc,1));
		x = x + deltax;
	}
	var x = state.x0;
	var y = state.y0cos;
	for (var i=0; i<nsines; i++) {
		var amp = state.cosAmp[i].data[2]*state.hScale;
		drawAmp(c, new Vector(x,y), new Vector(x,y+amp) );
		state.cosAmp[i].data[0] = x;
		var yc = y+amp;
		state.cosAmp[i].data[1] = yc;
		x = x + deltax;
	}
	//
	// draw the waveform
	//
	var dx = (state.x2plot-state.x1plot)/state.npoints;
	var x = 0;
	path = [];
	var ampl = 20*4/Math.PI;
	if (first) DBG.write("amp "+round(ampl,1)+" period "+state.period+" nsines "+nsines);
	var y = 0;
	for (var n=0; n<state.npoints; n++) {
		y = 0;
		var xcenter = x + .5*dx;
		for (var i=1; i<nsines; i++) {
			var phase = i*Math.PI*xcenter/state.period;
			if (ifirst) DBG.write("i="+i+" phase="+round(phase,2)+" sinAmp="+round(state.sinAmp[i].data[2],2));
			var ysin = state.sinAmp[i].data[2]*Math.sin(phase);
			var ycos = state.cosAmp[i].data[2]*Math.cos(phase);
			y += ysin + ycos;
		}
		ifirst = false;
		y = y*ampl;
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
//simulation.renderSettings = function(state, c, w, h) {
//	renderWidgets(state.settingsWidgets, c, state);
//}


simulation.tabs["Simulation"].mouseUp = function(x, y, state, ev) {
	state.cur = false;
	state.isel = -1;
	var issine = true;
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	//
	// mouse is down, so choose which amplitude we are trying to change by hand.  use the
	// coordinate in state.sinAmp and state.cosAMP data[0]=x and data[1]=y within +- 1 in x and y
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
		}
		else if ( rc < 2 ) {
			state.isel = i;
			issine = false;
			state.cur = true;
			DBG.write("Found it! cos wave amplitude isel="+state.isel);
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
