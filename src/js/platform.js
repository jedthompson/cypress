window.images = {}
window.resources = {
	"all": [
		image("particle-red", "all/particle-red.png"),
		image("particle-blue", "all/particle-blue.png"),
		image("particle-grey", "all/particle-grey.png"),
	],
	"iOS": [
		image("IOSSliderWhite", "iOS/GenericSlider/SliderWhite.png"),
		image("IOSSliderBlue", "iOS/GenericSlider/SliderBlue.png"),
		image("IOSSliderCenter", "iOS/GenericSlider/SliderCenter.png"),
	],
	"android": [
	],
}

function getPlatformResources(platform) {
	var res = window.resources.all.concat(window.resources[platform]);
	return res;
}

function getResources() {
	//if (navigator.userAgent.match(/like Mac OS X/i))
		return getPlatformResources('iOS');
	return getPlatformResources('all');
}

function loadResources() {
	rset = getResources();
	rset.forEach(function (f) {f()});
}

function image(name, filename) {
	return function() {
		window.images[name] = getImage(filename);
	}
}

function stylesheet(filename) {
	return function() {
		var stylesheet = document.createElement('link');
		stylesheet.setAttribute('rel', 'stylesheet');
		stylesheet.setAttribute('href', '../css/'+filename);
		document.getElementsByTagName('head')[0].appendChild(stylesheet);
	}
}

function script(name) {
	return function() {
		var script = document.createElement('script');
		script.setAttribute('src', '../js/'+filename);
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}

loadResources();

