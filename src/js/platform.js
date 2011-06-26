window.images = {
	"particle-red": getImage("all/particle-red.png"),
	"particle-blue": getImage("all/particle-blue.png"),
	"particle-grey": getImage("all/particle-grey.png"),
	"IOSSliderWhite": getImage("iPhone/GenericSlider/SliderWhite.png"),
	"IOSSliderBlue": getImage("iPhone/GenericSlider/SliderBlue.png"),
	"IOSSliderCenter": getImage("iPhone/GenericSlider/SliderCenter.png"),
}

window.resources = {}

window.resources.gr = {
	"all": {
		"particle-red": image("all/particle-red.png"),
		"particle-blue": image("all/particle-blue.png"),
		"particle-grey": image("all/particle-grey.png"),
	},
	"iOS": {
		"IOSSliderWhite": image("iPhone/GenericSlider/SliderWhite.png"),
		"IOSSliderBlue": image("iPhone/GenericSlider/SliderBlue.png"),
		"IOSSliderCenter": image("iPhone/GenericSlider/SliderCenter.png"),
	},
	"android": {
	},
}

window.resources.css = {
	"all": {},
	"iOS": {},
	"android": {},
}

window.resources.js = {
	"all": {},
	"iOS": {},
	"android": {},
}

function getPlatformResources(platform) {
	var res = {};
	res.gr = Object.extend(window.resources.gr.all, window.resources.gr[platform]);
	res.css = Object.extend(window.resources.css.all, window.resources.css[platform]);
	res.js = Object.extend(window.resources.js.all, window.resources.js[platform]);
	return res;
}

function getResources() {
	if (navigator.userAgent.match(/like Mac OS X/i))
		return getPlatformResources('iOS');
	return getPlatformResources('all');
}

function image(name) {
	return function() {
		return getImage(name);
	}
}

