//PercentFull is given AS A DECIMAL (.5 = 50%)
function renderIOSSlider(xPosLeftOfBar, yPosTopOfBar, length, percentFull, context) {
	var xTL = xPosLeftOfBar;
	var yTL = yPosTopOfBar;
	var len = length;
	var pLen = len*480/100;
	var curPos = percentFull;
	if(curPos > len) {curPos = len;}
	if(curPos < 0) {curPos = 0;}
	var ctx = context;
	
	
	/*ctx.drawImage(window.images["IOSSliderWhite"], 0, 0, curPos*pLen, 9, xTL, yTL, ((curPos*pLen))*100/480, 9/4.8);
	ctx.drawImage(window.images["IOSSliderBlue"], (480-(pLen-curPos*pLen)), 0, pLen-(curPos*pLen), 9, xTL+(curPos*480), yTL, (pLen-(curPos*pLen)+12)*100/480, 9/4.8);
	ctx.drawImage(window.images["IOSSliderCenter"], (xTL+curPos*pLen)-12/4.8, yTL-(7/4.8), 23/4.8, 23/4.8);*/
	
	//TODO Display slider graphics
}
