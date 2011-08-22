var simulation_name = "Block on an Inclined Plane";

// create the simulation
var simulation = new Simulation(simulation_name);
destring ="The block on an inclined plane is a classic physics demonstration that illustrates friction, ";
destring += "gravity, and the normal force, among other concepts.  As the incline gets steeper, the ";
destring += "normal force grows smaller due to gravity being pointed more and more orthogonal to the ";
destring += "inclined plane.  As the normal force decreases in magnitude, so does the frictional force, ";
destring += "and so the block accelerates faster down the plane.  The block also accelerates faster if ";
destring += "the coefficient of kinetic friction is decreased.   Note that using a coordinate system ";
destring += "that is centered on the block and parallel and perpendicular to the inclined plane makes ";
destring += "the calculation of the net acceleration very easy!";
simulation.description = destring;

// The number of milliseconds in between consecutive calls to
// simulation.step(). (Simulation.render2d() is called immediately after step
// regardless of this value.) Rule of thumb: keep it in between 15 and 35.
simulation.dt = 100;

// This function transforms a state variable into a correct initial state for
// the simulation. It is called below, when the simulation is first loaded, and
// also whenever the simulation reaches an end point (and needs to be reset for
// anything to happen) - in this case, such an endpoint would be when the block
// reaches the end of the ramp.
simulation.init_state = function(state){
	//Initialize variables
	state.showComponents = true;
	state.x0 = simulation.getWidth()/4;
	state.lengthX = 60;
	state.y0 = -simulation.getHeight()/2;
	state.mu = state["muSlider"];
	state.thetaD=state["thetaSlider"];
	state.g = 9.8;
	state.t = 0;
	state.displayForceVectors = true;
	
	//Check to see if values are valid
	if(state.mu < 0) {state.mu = 0;}
	if(state.thetaD <= 0.01) {state.thetaD = .01;}
	if(state.thetaD >= 89) {state.thetaD = 89;};
	if(state.g < 0) {state.g = 0;}
	
	//Convert theta to radians for math
	state.thetaR = state.thetaD*2*Math.PI/360;
	
	//Calculate initial position
	state.xPos = state.x0-(state.lengthX/Math.tan(state.thetaR));
//	if(state.xPos < -40) {state.xPos = -40;}
	state.yPos = state.y0+((state.x0-state.xPos)*Math.tan(state.thetaR));
	state.xInit = state.xPos;
	state.yInit = state.yPos;
	
	//Calculate acceleration
	state.scaleit = 3.
	state.acc = state.scaleit*((state.g*Math.sin(state.thetaR))-(state.mu*state.g*Math.cos(state.thetaR)));
	if(state.acc <= 0) {state.acc = 0;}
	state.xAcc = state.acc*Math.cos(state.thetaR);
	state.yAcc = -(state.acc*Math.sin(state.thetaR));
	
	return state;
}

// Set up the widgets
simulation.setup = function(state) {
	state["thetaSlider"] = 30;
	state["muSlider"] = 0.4;
	state.settingsWidgets = [];
	var theta = String.fromCharCode(952);
	var strsld = "Incline Angle ("+theta+")";
	state.settingsWidgets[0] = new Slider(-30, 20, 70, 6, "thetaSlider", 1, 89, strsld);
	state.settingsWidgets[1] = new Slider(-30, 0, 70, 6, "muSlider", 0, 1,"Friction");
	
	generateDefaultWidgetHandler(simulation, 'Settings', state.settingsWidgets);
	
	simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
		state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
		state.thetaD = state["thetaSlider"];
		state.thetaR = state.thetaD*2*Math.PI/360;
		state.mu = state["muSlider"];
	
/*		state.xInit = 40-(60/Math.tan(state.thetaR));
		if(state.xInit < -40) {state.xInit = -40;}
		state.yInit = -30+((40-state.xInit)*Math.tan(state.thetaR));
	
		state.acc = (state.g*Math.sin(state.thetaR))-(state.mu*state.g*Math.cos(state.thetaR));
		if(state.acc <= 0) {state.acc = 0;}
		state.xAcc = state.acc*Math.cos(state.thetaR);
		state.yAcc = -(state.acc*Math.sin(state.thetaR));
*/
		state = simulation.init_state(simulation.state);
		return state;
	}
	
	state = simulation.init_state(simulation.state);
	return state;
}

// Called every simulation.dt milliseconds to update the state.
simulation.step = function(state) {
	state.t += 0.001 * simulation.dt;
	
	state.xPos = state.xInit + (0.5*state.xAcc*state.t*state.t);
	state.yPos = state.yInit + (0.5*state.yAcc*state.t*state.t);
	
	if(state.yPos < state.y0) {
		// When the block has finished falling, we reset the simulation
		// so it can fall again.
		state = simulation.init_state(state);
	}
	return state; // And return the new state.
}

// Render a two-dimensional diagram of the simulation.
//
// This function should perform as little computation as possible - all the
// simulation should have been completed in the step() function. Here, we just
// show the results.
simulation.render2d = function(state, c, w, h) {
	// 'state' is a copy of the state variable created above

	// 'c' is a graphics context allowing us to draw to the canvas

	// w and h are the dimensions of the screen. The smallest one is
	// guaranteed to be 100.
	
	//Code to draw the inclined plane
	c.beginPath();
	c.moveTo(state.x0,state.y0);
	c.lineTo(state.xInit,state.yInit);
	c.lineTo(state.xInit,state.y0);
	c.lineTo(state.x0,state.y0);
	c.stroke();
	var theta = String.fromCharCode(952);
	var oldfont = c.font;
	c.font = "30pt Arial";
	c.text(theta,state.x0-15,state.y0+1);
//	c.font = oldfont;
	c.font = "24pt Fixed";

	//Code to draw the box
	c.beginPath(); // begin a new path (discarding old path data)
	var x1=state.xPos-2*Math.cos(state.thetaR);
	var y1=state.yPos+2*Math.sin(state.thetaR);
	var x2=x1+4*Math.sin(state.thetaR);
	var y2=y1+4*Math.cos(state.thetaR);
	var x3=x2+4*Math.cos(state.thetaR);
	var y3=y2-4*Math.sin(state.thetaR);
	var x4=state.xPos+2*Math.cos(state.thetaR);
	var y4=state.yPos-2*Math.sin(state.thetaR);
	c.moveTo(x1,y1);
	c.lineTo(x2,y2);
	c.lineTo(x3,y3);
	c.lineTo(x4,y4);
	c.lineTo(x1,y1);
	c.stroke();

	//Code to display force vectors
	if(state.displayForceVectors) {
		var gravity = state.scaleit*state.g;
		var xC = (x3+x1)/2;
		var yC = (y3+y1)/2;
		vector2dAtAngle(xC,yC,gravity,270,c);
		c.text("G",xC-1,yC-gravity-3.3);
		if (state.showComponents) {
			var x0 = xC;
			var y0 = yC - gravity;
			var gx = gravity*Math.sin(state.thetaR);
			oldwidth = c.lineWidth;
			oldcolor = c.fillStyle;
			c.fillStyle = "red";
			c.lineWidth = 0.1;
			c.beginPath();
			c.moveTo(x0,y0);
			c.lineTo(x0 - gx*Math.cos(state.thetaR), y0 + gx*Math.sin(state.thetaR));
			c.lineTo(xC,yC);
			c.stroke();
			c.lineWidth = oldwidth;
			c.fillStyle = oldcolor;
		}
		//
		var fN = state.g*Math.cos(state.thetaR);
		var fNx = state.scaleit*fN*Math.sin(state.thetaR);
		var fNy = state.scaleit*fN*Math.cos(state.thetaR);
		vector2dAtAngle(xC,yC,fN*state.scaleit,90-state.thetaD,c);
		c.text("N",xC+fNx+1,yC+fNy+1);
		var ff = fN*state.mu;
		if(state.mu != 0) {
			var fx = state.mu*gravity*Math.cos(state.thetaR);
			var fy = state.mu*gravity*Math.sin(state.thetaR);
			drawVector(xC,yC,state.mu*gravity*Math.cos(state.thetaR),180+(state.thetaD),c);
			c.text("f",xC-fx-.5,yC+fy+.5);
		}
		if (state.acc > 0) {
			var accMag = gravity*Math.sin(state.thetaR) - fN;
			var accx = accMag*Math.cos(state.thetaR);
			var accy = accMag*Math.cos(state.thetaR);
			drawVectorColor(xC,yC,accMag,360+state.thetaD,c,"blue");
			oldcolor = c.fillStyle;
			c.fillStyle = "blue";
			c.text("a",xC+accx+.5,yC-accy);
			c.fillStyle = oldcolor;
		}

		c.text("N: normal 'acceleration'   "+round(fN,2),state.x0,45);
		c.text("G: gravity 'acceleration'  "+round(state.g,2),state.x0,40);
		c.text("   down the plane             "+round(state.g*Math.sin(state.thetaR),2),state.x0,35);
		c.text("   normal to the plane        "+round(state.g*Math.cos(state.thetaR),2),state.x0,30);		
		c.text("f: friction 'acceleration' "+round(ff,2),state.x0,25);
		oldcolor = c.fillStyle;
		c.fillStyle = "blue";
		c.text("a: net acceleration        "+round(state.acc/state.scaleit,2)+" down the incline",state.x0,20);
		c.fillStyle = oldcolor;
	}
}

// Like render2d, but for the settings tab. We just outsource this to the
// widgets library.
simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}

function drawVector(a,b,c,d,context) {
	vector2dAtAngle(a,b,c,(360-d),context);
}

function drawVectorColor(a,b,c,d,context,color) {
	vector2dAtAngle(a,b,c,(360-d),context,color);
}

/*
// Similar to render2d, but for a different tab.
simulation.renderForceDiagram = function(state, c, w, h) {
	//Code to draw the box
	var ctx = c;
	var SIDELENGTH = 6;
	
	var xC = 0;
	var yC = 0;
	ctx.beginPath();
	var x1=xC-(SIDELENGTH/2)*Math.sin(state.thetaR)-(SIDELENGTH/2)*Math.cos(state.thetaR);
	var y1=yC-(SIDELENGTH/2)*Math.cos(state.thetaR)+(SIDELENGTH/2)*Math.sin(state.thetaR);
	var x2=x1+SIDELENGTH*Math.sin(state.thetaR);
	var y2=y1+SIDELENGTH*Math.cos(state.thetaR);
	var x3=x2+SIDELENGTH*Math.cos(state.thetaR);
	var y3=y2-SIDELENGTH*Math.sin(state.thetaR);
	var x4=xC-(SIDELENGTH/2)*Math.sin(state.thetaR)+(SIDELENGTH/2)*Math.cos(state.thetaR);
	var y4=yC-(SIDELENGTH/2)*Math.cos(state.thetaR)-(SIDELENGTH/2)*Math.sin(state.thetaR);
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineTo(x3,y3);
	ctx.lineTo(x4,y4);
	ctx.lineTo(x1,y1);
	ctx.stroke();

	//Code to display coordinate system
	drawVector(-40,40,5,(state.thetaD),ctx);
	drawVector(-40,40,5,270+(state.thetaD),ctx);
	ctx.fillStyle="#000";
	//ctx.font="12pt Verdana";
	//ctx.fillText("x",120-50*Math.sin(theta), 40+50*Math.sin(theta));
	//ctx.fillText("y",50+50*Math.sin(theta), 10+50*Math.sin(theta));

	//Code to display force vectors
	//var xC = (x3+x1)/2;
	//var yC = (y3+y1)/2;
	drawVector(xC,yC,state.g*3,90,ctx);
	drawVector(xC,yC,state.g*3*Math.cos(state.thetaR),270+(state.thetaD),ctx);
	if(state.mu != 0) {
		if(state.acc <= 0) {drawVector(xC,yC,state.g*3*Math.sin(state.thetaR),180+(state.thetaD),ctx);}
		else {drawVector(xC,yC,state.mu*state.g*3*Math.cos(state.thetaR),180+(state.thetaD),ctx);}
	}

	var yComp = 0;
	var xComp = 0;
	var isXZero = false;
	var isYZero = false;
	if(state.acc <= 0) {yComp = 0;}
	else {yComp = (state.g*3*Math.cos(state.thetaR))*Math.cos(state.thetaR) + (state.mu*state.g*3*Math.cos(state.thetaR))*Math.sin(state.thetaR) - state.g*3;}
	if(yComp > -0.05) {yComp = 0; isYZero = true;}

	if(state.acc <= 0) {xComp = (state.g*3*Math.cos(state.thetaR))*Math.sin(state.thetaR) - (state.g*3*Math.sin(state.thetaR))*Math.cos(state.thetaR);}
	else {xComp = (state.g*3*Math.cos(state.thetaR))*Math.sin(state.thetaR) - (state.mu*state.g*3*Math.cos(state.thetaR))*Math.cos(state.thetaR);}
	if(xComp <= 0.05) {xComp = 0; isXZero = true;}

	
	if(!isYZero || !isXZero) {
		var compSum = Math.sqrt(xComp*xComp + yComp*yComp);
		var compAngle = 360-Math.atan(yComp/xComp)*360/(2*Math.PI);
		drawVectorColor(xC,yC,xComp,0,ctx,"rgb(0,0,255)");
		drawVectorColor(xC+xComp,yC,0-yComp,90,ctx,"rgb(0,0,255)");
		drawVectorColor(xC,yC,compSum,compAngle,ctx,"rgb(255,0,0)");
	}
}

// Add a tab named "force diagram" to the simulation, using renderForceDiagram
// as the renderer.
simulation.addTab('Force Diagram', simulation.renderForceDiagram);

*/