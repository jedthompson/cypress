var simulation_name = "Nuclear Decay";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;

function init_state(state) {
	state.mu=0.2;
	state.thetaD=30;
	state.g = 9.8;
	state.t = 0;
	state.displayForceVectors = true;
	
	//Check to make sure values for variables are valid
	if(state.mu<0) {state.mu = 0;}
	if(state.thetaD <= 0) {state.thetaD = .01;}
	if(state.thetaD >= 89) {state.thetaD = 89;}
	if(state.g < 0) {state.g = 0;}
	
	//Convert theta to radians for math
	state.thetaR=state.thetaD*2*Math.PI/360;
	
	//Calculate initial position
	state.xPos=90-(60/Math.tan(state.thetaR));
	if(state.xPos < 10) {state.xPos = 10;}
	state.yPos=80-((90-state.xPos)*Math.tan(thetaR));
	state.xInit = xPos;
	state.yInit = yPos;
	
	//Calculate acceleration
	state.acc = (g*Math.sin(thetaR))-(mu*g*Math.cos(thetaR));
	if(state.acc <= 0) {acc = 0;}
	state.xAcc = state.acc*Math.cos(theta);
	state.yAcc = state.acc*Math.sin(theta);
	
	return state;
}

simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	state.t += .05;
	state.xPos = state.xInit + (.5*state.xAcc*state.t*state.t);
	state.yPos = state.yInit + (.5*state.yAcc*state.t*state.t);
	
	if(state.yPos > 80) {
		state = init_state(state);
	}
	return state;
}

simulation.render2d = function(state, c, w, h) {
	//Draw inclined plane
	c.beginPath();
	c.moveTo(40,260);
	c.lineTo(440,260);
	c.lineTo(xInit,yInit);
	c.lineTo(40,260);
	c.strokeStyle="#000";
	c.stroke();
	
	//Code to draw the box
	c.beginPath();
	var x1=xPos-3*Math.cos(theta);
	var y1=yPos-3*Math.sin(theta);
	var x2=x1+6*Math.sin(theta);
	var y2=y1-6*Math.cos(theta);
	var x3=x2+6*Math.cos(theta);
	var y3=y2+6*Math.sin(theta);
	var x4=xPos+3*Math.cos(theta);
	var y4=yPos+3*Math.sin(theta);
	c.moveTo(x1,y1);
	c.lineTo(x2,y2);
	c.lineTo(x3,y3);
	c.lineTo(x4,y4);
	c.lineTo(x1,y1);
	c.stroke();
	
	//Code to display force vectors
	if(displayForceVectors) {
		var xC = (x3+x1)/2;
		var yC = (y3+y1)/2;
		drawVector(xC,yC,g*5,90,ctx);
		drawVector(xC,yC,g*5*Math.cos(state.thetaR),270+(state.thetaD*360/(2*Math.PI)),c);
		if(state.mu != 0) {
			if(state.acc <= 0) {drawVector(xC,yC,g*5*Math.sin(state.thetaR),180+(state.thetaD*360/(2*Math.PI)),c);}
			else {drawVector(xC,yC,state.mu*state.g*5*Math.cos(state.thetaR),180+(state.thetaD*360/(2*Math.PI)),c);}
		}
	}
}

function drawVector(a,b,c,d,context) {
	//if(c < 0.2) {return;}
	var x1=a;
	var y1=b;
	var len=c;
	var phi=d*2*Math.PI/360;
	var x2=x1+(len*Math.cos(phi));
	var y2=y1+(len*Math.sin(phi));
	var ctx=context;

	var arrowLength = len/6;
	if(arrowLength > 10) {arrowLength = 10;}
	if(arrowLength < 5) {arrowLength = 5;}

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
	ctx.stroke();
}

