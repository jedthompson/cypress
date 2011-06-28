var simulation_name = "Gas Diffusion";

var simulation = new Simulation(simulation_name);
simulation.dt = 50;
simulation.description = "In this simulation, the two gases start on separate sides of the box, but gradually diffuse until each side has approximately the same number of blue gas particles and red gas particles as the other.";

function init_state(state) {
	state.numA = 50;
	state.numB = 50;
	state.ballRad = .2;
	state.t = 0;
	state.pP = new Array();
	state.pV = new Array();
	
	// In the particle and velocity list, the A particles are ALWAYS stored before the B particles.  This saves the need for two arrays
	for(var i = 0; i < state.numA+state.numB; i++) {
		if(i < state.numA) {
			state.pP[i] = new Vector((Math.random()*30)-35, 30-(Math.random()*60));
		} else {
			state.pP[i] = new Vector((Math.random()*30)+5, 30-(Math.random()*60));
		}
		state.pV[i] = new Vector(((Math.random()*4)-2), ((Math.random()*4)-2));
	}
	return state;
}
simulation.state = init_state(simulation.state);

simulation.step = function(state) {
	checkCollision(state);
	
	for(var i = 0; i<state.numA+state.numB; i++) {
		state.pP[i] = addV(state.pP[i], state.pV[i].scale(simulation.dt*.005));
		if(state.pP[i].data[0]>(-1*(state.ballRad+.5)) && state.pP[i].data[0] <=0 && (state.pP[i].data[1] <=-10 || state.pP[i].data[1] >=10) && state.pV[i].data[0] > 0) {
			state.pV[i].data[0] = -1*state.pV[i].data[0];
			state.pP[i].data[0] = (-1*(state.ballRad+.5));
		}
		else if(state.pP[i].data[0]<(state.ballRad+.5) && state.pP[i].data[0] >=0 && (state.pP[i].data[1] <=-10 || state.pP[i].data[1] >=10) && state.pV[i].data[0] < 0) {
			state.pV[i].data[0] = -1*state.pV[i].data[0];
			state.pP[i].data[0] = (state.ballRad+.5);
		}
		else if(state.pP[i].data[0]>(40-state.ballRad)) {state.pV[i].data[0]=-state.pV[i].data[0]; state.pP[i].data[0]=40-state.ballRad;}
		else if(state.pP[i].data[0]<(-40+state.ballRad)) {state.pV[i].data[0]=-state.pV[i].data[0]; state.pP[i].data[0]=-40+state.ballRad;}
		if(state.pP[i].data[1]>(40-state.ballRad)) {state.pV[i].data[1]=-state.pV[i].data[1]; state.pP[i].data[1]=40-state.ballRad;}
		else if(state.pP[i].data[1]<(-40+state.ballRad)) {state.pV[i].data[1]=-state.pV[i].data[1]; state.pP[i].data[1]=-40+state.ballRad;}
	}
	state.t+=simulation.dt*.01;
	
	return state;
}

function checkCollision(state) {
	for(var i = 0; i < state.numA+state.numB; i++) {
		for(var j = i+1; j < state.numA+state.numB; j++) {
			var xPos1 = state.pP[i].data[0];
			var yPos1 = state.pP[i].data[1];
			var xPos2 = state.pP[j].data[0];
			var yPos2 = state.pP[j].data[1];
			var xVel1 = state.pV[i].data[0];
			var yVel1 = state.pV[i].data[1];
			var xVel2 = state.pV[j].data[0];
			var yVel2 = state.pV[j].data[1];
  			// get distances between the balls components
  			var xDist = xPos2 - xPos1;
  			var yDist = yPos2 - yPos1;

  			// calculate magnitude of the vector separating the balls
  			var bVectMag = Math.sqrt((xDist*xDist) + (yDist*yDist));
  			if (bVectMag < (2*state.ballRad)+.5){
    				// get angle of bVect
   				var theta  = Math.atan(yDist, xDist);
    			// precalculate trig values
   				var sine = Math.sin(theta);
    			var cosine = Math.cos(theta);

    			/* bTemp will hold rotated ball positions. You 
     			just need to worry about bTemp[1] position*/
				var xPosTemp1 = 0;
				var yPosTemp1 = 0;
				var xPosTemp2 = 0;
				var yPosTemp2 = 0;
    			var xPosTemp2  = cosine * xDist + sine * yDist;
    			var yPosTemp2  = cosine * yDist - sine * xDist;

    			// rotate Temporary velocities
    			var xVelTemp1  = cosine * xVel1 + sine * yVel1;
    			var yVelTemp1  = cosine * yVel1 - sine * xVel1;
    			var xVelTemp2  = cosine * xVel2 + sine * yVel2;
    			var yVelTemp2  = cosine * yVel2 - sine * xVel2;

    			/* Now that velocities are rotated, you can use 1D
     			conservation of momentum equations to calculate 
     			the final velocity along the x-axis. */

    			// final rotated velocity for b[0]
    			var xVelFinal1 = xVelTemp2;
    			var yVelFinal1 = yVelTemp1;
    			// final rotated velocity for b[0]
    			var xVelFinal2 = xVelTemp1;
    			var yVelFinal2 = yVelTemp2;

    			// hack to avoid clumping
    			xPosTemp1 += xVelFinal1;
    			xPosTemp2 += xVelFinal2;

    			/* Rotate ball positions and velocities back
     			Reverse signs in trig expressions to rotate 
     			in the opposite direction */
    			// rotate balls
    			var xPosFinal1 = cosine * xPosTemp1 - sine * yPosTemp1;
    			var yPosFinal1 = cosine * yPosTemp1 + sine * xPosTemp1;
    			var xPosFinal2 = cosine * xPosTemp2 - sine * yPosTemp2;
    			var yPosFinal2 = cosine * yPosTemp2 + sine * xPosTemp2;
    			
    			//state.pP[i] = new Vector(xPos1+xPosFinal1, yPos1+yPosFinal1);
    			//state.pP[j] = new Vector(xPos2+xPosFinal2, yPos2+yPosFinal2);

    			// update velocities
    			state.pV[i] = new Vector(cosine * xVelFinal1 - sine * yVelFinal1, cosine * yVelFinal1 + sine * xVelFinal1);
    			state.pV[j] = new Vector(cosine * xVelFinal2 - sine * yVelFinal2, cosine * yVelFinal2 + sine * xVelFinal2);
  			}
    	}
	}
}

simulation.render2d = function(state, ctx, w, h) {
	//Code to draw the box
	ctx.beginPath();
	ctx.moveTo(-40,40);
	ctx.lineTo(0,40);
	ctx.lineTo(0,10);
	ctx.moveTo(0,-10);
	ctx.lineTo(0,-40);
	ctx.lineTo(-40,-40);
	ctx.lineTo(-40,40);
	ctx.moveTo(0,40);
	ctx.lineTo(40,40);
	ctx.lineTo(40,-40);
	ctx.lineTo(0,-40);
	//ctx.closePath();
	ctx.strokeStyle="#000";
	ctx.stroke();

	//Code to draw each particle on the screen
	ctx.strokeStyle="rgb(255,0,0)";
	ctx.fillStyle="rgb(255,0,0)";
	for(var i = 0; i<state.numA; i++) {
		ctx.beginPath();
		ctx.arc(state.pP[i].data[0],state.pP[i].data[1],state.ballRad,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	ctx.strokeStyle="rgb(0,0,255)";
	ctx.fillStyle="rgb(0,0,255)";
	for(var i = state.numA; i<state.numA+state.numB; i++) {
		ctx.beginPath();
		ctx.arc(state.pP[i].data[0],state.pP[i].data[1],state.ballRad,0,Math.PI*2,true);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}