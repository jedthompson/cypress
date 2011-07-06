function Widget(x, y, width, height, render, listener) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.render = render;
	this.listener = listener;
}

function handleMouseDown(xpos, ypos, widgets) {

}

function handleMouseUp(xpos, ypos, widgets) {

}

function handleMouseMove(xpos, ypos, widgets) {

}

//PercentFull is given AS A DECIMAL (.5 = 50%)
function renderIOSSlider(xPosLeftOfBar, yPosTopOfBar, length, percentFull, context) {
	var xTL = xPosLeftOfBar;
	var yTL = yPosTopOfBar;
	var len = length;
	var pLen = len*480/100;
	var curPos = percentFull;
	if(curPos > 1) {curPos = 1;}
	if(curPos < 0) {curPos = 0;}
	var ctx = context;
	
	var pXTL = xTL*480/100;
	var pYTL = yTL*320/100;
	var pCurLen = curPos*pLen;

	ctx.image(window.images["IOSSliderBlue"], 0, 0, pCurLen, 9, xTL, yTL, curPos*len, 9/4.8);
	ctx.image(window.images["IOSSliderWhite"], (480-pLen+pCurLen), 0, pLen-pCurLen, 9, xTL+(curPos*len), yTL, (len-curPos*len), 9/4.8);
	ctx.image(window.images["IOSSliderCenter"], xTL+(curPos*len)-12/4.8, yTL-(7/4.8), 23/4.8, 23/4.8);
}
