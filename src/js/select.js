function select_simulation() {
	var sim = document.location.search.slice(1);
	var script = document.createElement('script');
	script.setAttribute('src',sim+".js");
	document.getElementsByTagName("head")[0].appendChild(script);
}

