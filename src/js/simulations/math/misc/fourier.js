var simulation_name = "Fourier Synthesis";

var simulation = new Simulation(simulation_name);
simulation.dt = 200;
desString = "Fourier sythesis can be very powerful!.   Notice the amplitudes have either empty or ";
desString += "full circles.  If you click on the circle, it will toggle.   Full means enabled, empty ";
desString += "means disabled in the waveform.  You can also drag the amplitude by it's 'hook' (horizontal ";
desString += "bar at the top of the amplitude) to change the value.  And you can click on the waveform ";
desString += "itself to see the actual value.  Here is what the buttons do:<br>";
desString += "<ul><li>Click on the various waveform buttons to see different waveforms.<br>";
desString += "<li>'Zero': sets all amplitudes to zero<br>";
desString += "<li>'Disable': keeps the amplitudes but disables them";
desString += "<li>'Swap': to see what happens if you exchange the coefficients for the sin and cos ";
desString += "amplitudes.  See if you can guess what it should look like before you click!";
desString += "<li>'Reset' is like reloading the html</ul>";
simulation.description = desString;
debug = true;
ifirst = true;
DBG.enabled = false;
first = true;
nsines = null;
var temp = null;

simulation.init_state = function(state) {
	state.xmouseDown = null;
	state.ymouseDown = null;
	state.cur = false;
	state.grab = false;
	state.path = [];
	state.period = state["period"];
	state.fScale = state["fScale"];
	state.nsines = state["nsines"];
	nsines = Math.floor(state.nsines);
	state.alpha = state["alpha"];
	if (state.alpha < 0.001) state.alpha = 0.001;
	if (state.alpha > 1.999) state.alpha = 1.999;
	state.report = false;
	state.reportX = 0;
	state.reportY = 0;
	//
	// these arrays are vectors.   [0/1]=x/y coordinate to grab, [2]=amp, [3]=display value
	//
	//
	// square wave?
	//
	if (state.doSquareVariable) {
		state.ampl = state.hScale*2/Math.PI;
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i++) {
			var phase = i*Math.PI*state.alpha;
			state.sinAmp[i].data[2] = (1-Math.cos(phase))/i;
			state.sinAmp[i].data[3] = true;
			state.cosAmp[i].data[2] = Math.sin(phase)/i;
			state.cosAmp[i].data[3] = true;
		}
		state.cosAmp[0].data[3] = true;
	}
	if (state.doSquare) {
		state.ampl = state.hScale*2/Math.PI;
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i=i+2 ) {
			state.sinAmp[i].data[2] = 1/i;
			state.sinAmp[i].data[3] = true;
		}
	}
	if (state.doTriangle) {
		state.ampl = state.hScale*8/(Math.PI*Math.PI);
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i=i+2 ) {
			var powe = .5*(i-1);
			var nume = Math.pow(-1,powe);
			state.sinAmp[i].data[2] = nume/(i*i);
			state.sinAmp[i].data[3] = true;
		}
	}
	if (state.doTriangleVariable) {
		state.ampl = 2*state.hScale/(state.alpha*Math.PI*Math.PI*(2-state.alpha));
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		for (var i=1; i<nsines; i++) {
			var phase = i*Math.PI*state.alpha;
			var denom = i*i;
			state.sinAmp[i].data[2] = Math.sin(phase)/denom;
			state.sinAmp[i].data[3] = true;
			state.cosAmp[i].data[2] = (Math.cos(phase)-1)/denom;
			state.cosAmp[i].data[3] = true;
		}
		state.cosAmp[0].data[3] = true;
	}
	if (state.doSawtooth) {
		state.ampl = state.hScale/Math.PI;
		for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
		for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
		state.cosAmp[0].data[2] = .5*Math.PI;
		for (var i=1; i<nsines; i++ ) {
			state.sinAmp[i].data[2] = 1/i;
			state.sinAmp[i].data[3] = true;
		}
	}
	if (state.pleaseZero) {
		for (var i=0; i<nsines; i++) {
			state.sinAmp[i].data[2] = 0;
			state.cosAmp[i].data[2] = 0;
			state.sinAmp[i].data[3] = false;
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

simulation.setup = function(state) {
	//
	state.ygrab = 0;
	state.xgrab = -simulation.getWidth()/2+1;
	state.doSquare = true;
	state.doSquareVariable = false;
	state.doTriangle = false;
	state.doTriangleVariable = false;
	state.doSawtooth = false;
	state.pleaseSwap = false;
	state.pleaseZero = false;
	var buttonX0 = -30;
	var buttonY0 = 40;
	var buttonX1 = buttonX0;
	var buttonY1 = buttonY0 - 10;
	var buttonX2 = buttonX0;
	var buttonY2 = buttonY1 - 10;
	var buttonX3 = buttonX0;
	var buttonY3 = buttonY2 - 10;
	var buttonX4 = 40;
	var buttonY4 = 40;
	var buttonX5 = buttonX4;
	var buttonY5 = buttonY4 - 10;
	var buttonX6 = buttonX4;
	var buttonY6 = buttonY5 - 10;
	var buttonX7 = buttonX4;
	var buttonY7 = buttonY6 - 10;
	var buttonX8 = buttonX4;
	var buttonY8 = buttonY7 - 10;
	var buttonW = 50;
	var buttonH = 10;
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new Button(buttonX0,buttonY0,buttonW,buttonH,bfunctionRA, "Reset");
	state.settingsWidgets[1] = new Button(buttonX1,buttonY1,buttonW,buttonH,bfunctionSW, "Swap Sin/Cos");
	state.settingsWidgets[2] = new Button(buttonX2,buttonY2,buttonW,buttonH,bfunctionZ, "Zero");
	state.settingsWidgets[3] = new Button(buttonX3,buttonY3,buttonW,buttonH,bfunctionD, "Disable");
	state.settingsWidgets[4] = new Button(buttonX4,buttonY4,buttonW,buttonH,bfunctionSQ, "Square");
	state.settingsWidgets[5] = new Button(buttonX5,buttonY5,buttonW,buttonH,bfunctionSQV, "SqVariable");
	state.settingsWidgets[6] = new Button(buttonX6,buttonY6,buttonW,buttonH,bfunctionTR, "Triangle");
	state.settingsWidgets[7] = new Button(buttonX7,buttonY7,buttonW,buttonH,bfunctionVT, "Vtriangle");
	state.settingsWidgets[8] = new Button(buttonX8,buttonY8,buttonW,buttonH,bfunctionST, "Sawtooth");

//	state.hScale = 20;   // length of amplitude on the canvas if amp=1
	state.hScale = 40;   // length of amplitude on the canvas if amp=1
	state.x0 = 0;  // coord for amplitudes filled in render2d once we know the width 
	state.x1 = 1;  // ditto
	state.y0sin = 0; // ditto
	state.y0cos = 0; // ditto
	state["period"] = 15;
	var sliderX0 = -100;
	var sliderY0 = 35;
	var sliderX1 = sliderX0;
	var sliderY1 = sliderY0 - 15;
	var sliderX2 = sliderX1;
	var sliderY2 = sliderY1 - 15;
	var sliderX3 = sliderX2;
	var sliderY3 = sliderY2 - 15;
	var sliderW = 50;
	var sliderH = 6;
	state["fScale"] = 40;   // rescale the waveform
	state["alpha"] = .5;
	state["nsines"] = 30;
	state["period"] = 15;
	state.settingsWidgets[9] =  new Slider(sliderX0,sliderY0,sliderW,sliderH,"period",1,40,"Wavelength   ");
	state.settingsWidgets[10] = new Slider(sliderX1,sliderY1,sliderW,sliderH,"fScale",1,60,"Amplitude   ");
	state.settingsWidgets[11] = new Slider(sliderX2,sliderY2,sliderW,sliderH,"nsines",1,60,"# Terms");
	state.settingsWidgets[12] = new Slider(sliderX3,sliderY3,sliderW,sliderH,"alpha",0,2,"Duty Cycle");
	state.sinAmp = [];
	state.cosAmp = [];
	state.npoints = 200;
	state.x1plot = 0;		// x1plot/y1plot are for drawing the fourier waveform
	state.x2plot = 0.5*simulation.getWidth();
	state.x0 = -0.5*simulation.getWidth() + 15;		// x0/y0 are for drawing the amplitude grabbers
	state.x1 = -1;
	state.y0sin = 6;			// these are the offsets for the sin and cos grabbers
	state.y0cos = -.5*simulation.getHeight() + state.y0sin;
	state.y0sinC = state.y0sin;
	state.y0cosC = state.y0cos;
	state.waveBoxHeight = simulation.getHeight();

	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);

function bfunctionRA(d, state) {
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionSQ(state) {
	state.doSquare = true;
	state.doSquareVariable = false;
	state.doTriangle = false;
	state.doTriangleVariable = false;
	state.doSawtooth = false;
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionSQV(state) {
	state.doSquare = false;
	state.doSquareVariable = true;
	state.doTriangle = false;
	state.doTriangleVariable = false;
	state.doSawtooth = false;
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionTR(state) {
	state.doSquare = false;
	state.doSquareVariable = false;
	state.doTriangle = true;
	state.doTriangleVariable = false;
	state.doSawtooth = false;
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionVT(state) {
	state.doSquare = false;
	state.doSquareVariable = false;
	state.doTriangle = false;
	state.doTriangleVariable = true;
	state.doSawtooth = false;
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionST(state) {
	state.doSquare = false;
	state.doSquareVariable = false;
	state.doTriangle = false;
	state.doTriangleVariable = false;
	state.doSawtooth = true;
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionSW(state) {
	for (var i=0; i<nsines; i++) {
		var tamp = state.sinAmp[i].data[2];
		var ton = state.sinAmp[i].data[3];
		state.sinAmp[i].data[2] = state.cosAmp[i].data[2];
		state.sinAmp[i].data[3] = state.cosAmp[i].data[3];
		state.cosAmp[i].data[2] = tamp;
		state.cosAmp[i].data[3] = ton;
	}
	state.pleaseSwap = !state.pleaseSwap;
	first = true;
	return state;
}
function bfunctionZ(state) {
	state.doSquare = false;
	state.doTriangle = false;
	state.doSawtooth = false;
	for (var i=0; i<nsines; i++) state.sinAmp[i] = new Vector(0,0,0,false);
	for (var i=0; i<nsines; i++) state.cosAmp[i] = new Vector(0,0,0,false);
	state = simulation.init_state(simulation.state);
	return state;
}
function bfunctionD(state) {
	for (var i=0; i<nsines; i++) state.sinAmp[i].data[3] = false;
	for (var i=0; i<nsines; i++) state.cosAmp[i].data[3] = false;
	return state;
}

	state = simulation.init_state(simulation.state);
	return state;
}


simulation.step = function(state) {
	return state;
}

simulation.render2d = function(state, c, w, h) {
	//
	// draw the horizontal to divide into 2.  right panel will have the wave, left will have the
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
	// draw something to grab onto to change where the amplitudes are drawn, and what scale
	//
	c.lineWidth = .2;
	c.beginPath();
	c.moveTo(state.xgrab,h/2-2);
	c.lineTo(state.xgrab,-h/2+2);
	c.stroke();
	c.fillCircle(state.xgrab,state.ygrab,1);
	c.text(round(state.ygrab,2),state.xgrab+2,state.ygrab);
	c.lineWidth = .1;
	//
	// draw the sine and cosine amplitudes.
	// sines go on the top, cosines on the bottom, of the lower panel
	//
	// however, if we only have sin functions, forget the cosines!
	//
	var deltax = (state.x1 - state.x0)/nsines;
	var x = state.x0;
	state.y0sinC = state.y0sin + state.ygrab;
	state.y0cosC = state.y0cos + state.ygrab;
	var y = state.y0sinC;
	c.text("Sines",-w/2+4,y-1);
	for (var i=0; i<nsines; i++) {
		var amp = state.sinAmp[i].data[2]*state.hScale;
		var yc = y+amp;
		var on = state.sinAmp[i].data[3];
		state.sinAmp[i].data[0] = x;
		state.sinAmp[i].data[1] = yc;
		drawAmp(c, new Vector(x,y), new Vector(x,yc), on );
		var tens = Math.floor(i/10);
		var ones = i - 10*tens;
		c.text(tens,x-.5,y-3);
		c.text(ones,x-.5,y-5);
//		c.text(i,x-1,y-3);
//		if (state.sinAmp[i].data[3]) c.text(round(state.sinAmp[state.isel].data[2],2),
//				state.sinAmp[state.isel].data[0],state.y0sin+state.hScale+2);
//		if (first) DBG.write("Amp: sin["+i+"] x/y="+round(x,1)+"/"+round(yc,1)+" amp= "+round(amp,2));
		x = x + deltax;
	}
	var x = state.x0;
	var y = state.y0cosC;
	c.text("Cosines",-w/2+4,y-1);
	for (var i=0; i<nsines; i++) {
		var amp = state.cosAmp[i].data[2]*state.hScale;
		var yc = y+amp;
		var on = state.cosAmp[i].data[3];
		state.cosAmp[i].data[0] = x;
		state.cosAmp[i].data[1] = yc;
		drawAmp(c, new Vector(x,y), new Vector(x,yc), on );
		var tens = Math.floor(i/10);
		var ones = i - 10*tens;
		c.text(tens,x-.5,y-3);
		c.text(ones,x-.5,y-5);
//		c.text(i,x-1,y-3);
//		if (first) DBG.write("Amp: cos["+i+"] x/y="+round(x,1)+"/"+round(yc,1)+" amp= "+round(amp,2));
		x = x + deltax;
	}
	//
	// if something is changing, report it...
	//
	if (state.cur) {
		if (issine) {
			if (state.isel > -1) c.text(round(state.sinAmp[state.isel].data[2],3),
				state.sinAmp[state.isel].data[0],state.y0sinC+state.hScale+2);
		}
		else {
			if (state.isel > -1) c.text(round(state.cosAmp[state.isel].data[2],3),
				state.cosAmp[state.isel].data[0],state.y0cosC+state.hScale+2);
		}
	}
	//
	// draw the waveform
	//
	var x0 = (state.x2plot+state.x1plot)/2;
	var dx = (state.x2plot-state.x1plot)/state.npoints;
//	var x = 0;
	var x = state.x1plot;
	var y = 0;
	path = [];
	c.beginPath();
	c.moveTo(0,y);
	c.lineTo(w/2,y);
	c.stroke();
	c.moveTo(x0,h/2);
	c.lineTo(x0,-h/2);
	c.stroke();
	if (first) DBG.write("amp "+round(state.ampl,1)+" period "+state.period+" nsines "+nsines);
	for (var n=0; n<state.npoints; n++) {
		y = 0;
		var xcenter = x + .5*dx;
		for (var i=0; i<nsines; i++) {
			var phase = i*Math.PI*(xcenter-x0)/state.period;
			var ysin = 0;
			if (state.sinAmp[i].data[3]) ysin = state.sinAmp[i].data[2]*Math.sin(phase);
			var ycos = 0;
			if (state.cosAmp[i].data[3]) ycos = state.cosAmp[i].data[2]*Math.cos(phase);
			y += ysin + ycos;
			if (ifirst) DBG.write("Wave: i="+i+" phase="+round(phase,2)+" Amp: sin="+
				round(state.sinAmp[i].data[2],2)+" cos="+round(state.cosAmp[i].data[2],2)+
				" wave: sin="+round(ysin,2)+" cos="+round(ycos,2)+" tot="+round(y,2));
		}
		ifirst = false;
		y = .5*y*state.fScale;
//		y = .5*y*state.ampl;
		state.path[n] = new Vector(state.x1plot+xcenter,y);
//		if (first) DBG.write("n="+n+" x/y= "+round(x,2)+"/"+round(y,2));
		x += dx;
	}
	drawPath(c, state.path, "#00f");
	first = false;
	//
	if (state.report) {
		var xt = state.reportX - x0;
		var yt = state.reportY;
		c.text("x="+round(xt,2)+" y="+round(yt,2),10,-40);
		c.beginPath();
		c.fillCircle(state.reportX,state.reportY,.5);
		c.stroke();
	}
}

function drawAmp(c, start, end, onoff) {
	c.beginPath();
	if (onoff) c.fillCircle(start.data[0],start.data[1],0.5);
	else c.drawCircle(start.data[0],start.data[1],0.5);
//	c.arc(start.data[0],start.data[1],.5,2.*Math.PI,0,false);
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
	state.grab = false;
	//
	// if we've clicked on one of the amplitude bases without moving, that means we want to toggle
	// turning that amplitude on and off
	//
	dx = x - state.xmouseDown;
	dy = y - state.ymouseDown;
	if ( (dx == 0) && (dy == 0) ) {
		//
		// see if we've clicked on one of the sin or cos amplitude circles
		//
		DBG.write("dx/dy=0, x/y= "+round(x,2)+"/"+round(y,2));
		for (var i=0; i<nsines; i++) {
			xs = Math.abs(state.sinAmp[i].data[0] - x);
			ys = Math.abs(state.y0sinC - y);
			xc = Math.abs(state.cosAmp[i].data[0] - x);
			yc = Math.abs(state.y0cosC - y);
			if ( (xs < 1) && (ys < 1) ) {
				var temp = state.sinAmp[i].data[3];
				state.sinAmp[i].data[3] = !temp;
				DBG.write("clicked on sin amplitude "+i);
			}
			if ( (xc < 1) && (yc < 1) ) {
				var temp = state.cosAmp[i].data[3];
				state.cosAmp[i].data[3] = !temp;
				DBG.write("clicked on cos amplitude "+i);
			}
		}
	}
	return state;
}

simulation.tabs["Simulation"].mouseDown = function(x, y, state, ev) {
	//
	// mouse is down, so choose which amplitude we are dealing with
	//
	// see if we are changing the amplitude by dragging.  use the coordinate in 
	// state.sinAmp and state.cosAMP data[0]=x and data[1]=y within 2 radius of x and y
	//
	var dr = 2;
	state.xmouseDown = x;
	state.ymouseDown = y;
	var xcoord = x;
	var ycoord = y;
	DBG.write("Mousedown x="+round(xcoord,1)+" y="+round(ycoord,1));
	//
	// x>0 means we are in the region where the waveform is drawn.   so far all we do is report coordinates
	//
	if (x > 0) {
		state.report = true;
		state.reportX = x;
		state.reportY = y;
	}
	//
	// see if we are clicking on the amplitudes
	//
	for (var i=0; i<nsines; i++) {
		DBG.write("sin["+i+"] x= "+round(state.sinAmp[i].data[0],1)+" y= "+round(state.sinAmp[i].data[1],1));
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
	//
	// see if we are grabbing the "grabber" that pulls the amplitudes up and down to be able to see them
	//
	var xgrb = xcoord - state.xgrab;
	var ygrb = ycoord - state.ygrab;
	var rgrb = Math.sqrt( xgrb*xgrb + ygrb*ygrb );
	DBG.write("xgrb="+round(xgrb,1)+" ygrb="+round(ygrb,1)+" rgrb="+round(rgrb,2));
	if (rgrb < 1) state.grab = true;
	//
	return state;
}

simulation.tabs["Simulation"].mouseMove = function(x, y, state, ev) {
	var xcoord = x;
	var ycoord = y;
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
			var oamp = state.sinAmp[state.isel].data[2];
			DBG.write(" old amp = "+
				round(oamp,2)+
				" hscale="+
				state.hScale+
				" ycoord="+
				round(ycoord,2)+
				" state.y0sinC = "+
				state.y0sinC+
				" state.ygrab="+
				round(state.ygrab,2));
			var deltaH = ycoord - state.y0sinC;
			state.sinAmp[state.isel].data[2] = deltaH/state.hScale;
			DBG.write(" Rescaling sin amplitude to "+round(state.sinAmp[state.isel].data[2],2));
		}
		else {
			var deltaH = ycoord - state.y0cosC;
			state.cosAmp[state.isel].data[2] = deltaH/state.hScale;
		}
	}
	if (state.grab) state.ygrab = ycoord;
	return state;
}
