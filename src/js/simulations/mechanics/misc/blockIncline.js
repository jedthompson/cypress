var simulation_name = "Block on an Inclined Plane";

var simulation = new Simulation(simulation_name);
simulation.dt = 20;
simulation.description = "The block on an inclined plane displays friction, gravity, forces, etc.";

function init_state(state) {
	//Initialize variables
	state.mu=0.2;
	state.thetaD=30;
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
	state.yPos = 30-((40-state.xPos)*Math.tan(state.thetaR));
	//alert("xPos is " + xPos + " and yPos is " + yPos);
	state.xInit = state.xPos;
	state.yInit = state.yPos;
	
	//Calculate acceleration
	state.acc = (state.g*Math.sin(state.thetaR))-(state.mu*state.g*Math.cos(state.thetaR));
	if(state.acc <= 0) {state.acc = 0;}
	state.xAcc = state.acc*Math.cos(state.thetaR);
	state.yAcc = state.acc*Math.sin(state.thetaR);
	
	return state;
}

simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t += 0.001 * simulation.dt;
	
	state.xPos = state.xInit + (0.5*state.xAcc*state.t*state.t);
	state.yPos = state.yInit + (0.5*state.yAcc*state.t*state.t);
	
	if(state.yPos > 30) {
		state = init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	
	//c.strokeWidth = .2;
	
	//Code to draw the inclined plane
	c.beginPath();
	c.moveTo(-40,30);
	c.lineTo(40,30);
	c.lineTo(state.xInit,state.yInit);
	c.lineTo(-40,30);
	c.strokeStyle="#000";
	c.stroke();
	
	//Code to draw the box
	c.beginPath();
	var x1=state.xPos-2*Math.cos(state.thetaR);
	var y1=state.yPos-2*Math.sin(state.thetaR);
	var x2=x1+4*Math.sin(state.thetaR);
	var y2=y1-4*Math.cos(state.thetaR);
	var x3=x2+4*Math.cos(state.thetaR);
	var y3=y2+4*Math.sin(state.thetaR);
	var x4=state.xPos+2*Math.cos(state.thetaR);
	var y4=state.yPos+2*Math.sin(state.thetaR);
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
		drawVector(xC,yC,state.g*2,90,c);
		drawVector(xC,yC,state.g*2*Math.cos(state.thetaR),270+(state.thetaD),c);
		if(state.mu != 0) {
			if(state.acc <= 0) {drawVector(xC,yC,state.g*2*Math.sin(state.thetaR),180+(state.thetaD),c);}
			if(state.acc <= 0) {drawVector(xC,yC,state.g*2*Math.sin(state.thetaR),180+(state.thetaD),c);}
			else {drawVector(xC,yC,state.mu*state.g*2*Math.cos(state.thetaR),180+(state.thetaD),c);}
		}
	}
}

function drawVector(a,b,c,d,context) {
	//if(c < 0.2) {return;}
	/*var x1=a;
	var y1=b;
	var len=c;
	var phi=d*2*Math.PI/360;
	var x2=x1+(len*Math.cos(phi));
	var y2=y1+(len*Math.sin(phi));
	var ctx=context;

	var arrowLength = len/6;
	if(arrowLength > 4) {arrowLength = 4;}
	if(arrowLength < 2) {arrowLength = 2;}

	var xC=x2+arrowLength*(Math.cos(phi-(135*2*Math.PI/360)));
	var yC=y2+arrowLength*(Math.sin(phi-(135*2*Math.PI/360)));
	var xCC=x2+arrowLength*(Math.cos(phi+(135*2*Math.PI/360)));
	var yCC=y2+arrowLength*(Math.sin(phi+(135*2*Math.PI/360)));

	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.lineTo(xC,yC);
	ctx.moveTo(x2,y2);
	ctx.lineTo(xCC,yCC);
	ctx.strokeStyle="#000";
	ctx.stroke();*/
	vector2dAtAngle(a,b,c,(360-d),context);
}
