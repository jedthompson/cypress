var simulation_name = "Block on an Inclined Plane";

var simulation = new Simulation(simulation_name);
simulation.description = "The block on an inclined plane is a classic physics demonstration that illustrates friction, gravity, and the normal force, among other concepts.  As the incline gets steeper, the normal force grows smaller due to gravity being pointed less and less towards the inclined plane.  As the normal force decreases in magnitude, so does the frictional force, and so the block accelerates faster.  The block also accelerates faster if the coefficient of kinetic friction is decreased.";

// The number of milliseconds in between consecutive calls to
// simulation.step(). (Simulation.render2d() is called immediately after step
// regardless of this value.) Rule of thumb: keep it in between 15 and 35.
simulation.dt = 20;

function init_state(state) {
	//Initialize variables
	state.mu=0.2;
	state.thetaD=90*state.widgetData["thetaSlider"];
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
	state.xPos = 40-(60/Math.tan(state.thetaR));
	if(state.xPos < -40) {state.xPos = -40;}
	state.yPos = -30+((40-state.xPos)*Math.tan(state.thetaR));
	//alert("xPos is " + xPos + " and yPos is " + yPos);
	state.xInit = state.xPos;
	state.yInit = state.yPos;
	
	//Calculate acceleration
	state.acc = (state.g*Math.sin(state.thetaR))-(state.mu*state.g*Math.cos(state.thetaR));
	if(state.acc <= 0) {state.acc = 0;}
	state.xAcc = state.acc*Math.cos(state.thetaR);
	state.yAcc = -(state.acc*Math.sin(state.thetaR));
	
	return state;
}

simulation.setup = function(state) {
	state.widgetData = new Object();
	state.widgetData["thetaSlider"] = 1/3;
	state.settingsWidgets = [];
	state.settingsWidgets[0] = new slider(-30, 20, 60, 9/4.8, "thetaSlider", "IOS");
	state = init_state(simulation.state);
	return state;
}

simulation.step = function(state) {
	state.t += 0.001 * simulation.dt;
	
	state.xPos = state.xInit + (0.5*state.xAcc*state.t*state.t);
	state.yPos = state.yInit + (0.5*state.yAcc*state.t*state.t);
	
	if(state.yPos < -30) {
		state = init_state(state);
	}
	return state;
}

// Render a two-dimensional diagram of the simulation.
simulation.render2d = function(state, c, w, h) {
	// 'state' is a copy of the state variable created above

	// 'c' is a graphics context allowing us to draw to the canvas

	// w and h are the dimensions of the screen. The smallest one is
	// guaranteed to be 100.
	
	//Code to draw the inclined plane
	c.beginPath();
	c.moveTo(-40,-30);
	c.lineTo(40,-30); // so, a line from (-40, -30) to (40, -30)
	c.lineTo(state.xInit,state.yInit);
	c.lineTo(-40,-30);
	c.strokeStyle="#000"; // the color of the stroke, as a hexidecimal RGB value
	c.stroke(); // draw the path we created
	
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
		var xC = (x3+x1)/2;
		var yC = (y3+y1)/2;
		vector2dAtAngle(xC,yC,state.g*2,270,c);
		vector2dAtAngle(xC,yC,state.g*2*Math.cos(state.thetaR),90-state.thetaD,c);
		if(state.mu != 0) {
			if(state.acc <= 0) {drawVector(xC,yC,state.g*2*Math.sin(state.thetaR),180+(state.thetaD),c);}
			if(state.acc <= 0) {drawVector(xC,yC,state.g*2*Math.sin(state.thetaR),180+(state.thetaD),c);}
			else {drawVector(xC,yC,state.mu*state.g*2*Math.cos(state.thetaR),180+(state.thetaD),c);}
		}
	}
}

simulation.renderSettings = function(state, c, w, h) {
	renderWidgets(state.settingsWidgets, c, state);
}

function drawVector(a,b,c,d,context) {
	vector2dAtAngle(a,b,c,(360-d),context);
}

function drawVectorColor(a,b,c,d,context,color) {
	vector2dAtAngle(a,b,c,(360-d),context,color);
}

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

simulation.addTab('Force Diagram', simulation.renderForceDiagram);

simulation.tabs["Settings"].mouseMove = function(x, y, state, ev) {
	state = handleMouseMove(x, y, state, ev, state.settingsWidgets);
	return state;
}

simulation.tabs["Settings"].mouseDown = function(x, y, state, ev) {
	state = handleMouseDown(x, y, state, ev, state.settingsWidgets);
	return state;
}

simulation.tabs["Settings"].mouseUp = function(x, y, state, ev) {
	state = handleMouseUp(x, y, state, ev, state.settingsWidgets);
	state.thetaD = 90*state.widgetData["thetaSlider"];
	state.thetaR = state.thetaD*2*Math.PI/360;
	
	state.xInit = 40-(60/Math.tan(state.thetaR));
	if(state.xInit < -40) {state.xInit = -40;}
	state.yInit = -30+((40-state.xInit)*Math.tan(state.thetaR));
	
	state.acc = (state.g*Math.sin(state.thetaR))-(state.mu*state.g*Math.cos(state.thetaR));
	if(state.acc <= 0) {state.acc = 0;}
	state.xAcc = state.acc*Math.cos(state.thetaR);
	state.yAcc = -(state.acc*Math.sin(state.thetaR));
	return state;
}
