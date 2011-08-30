// Sprite manipulation

function SpriteSet2D(limit, res) {
	this.gridSize = vBO(function(a,b){return a/b})(limit, res);
	this.data = new Array(res.data[0]);
	for (i=0; i<res.data[0]; i++) {
		this.data[i] = new Array(res.data[1]);
		for (j=0; j<res.data[1]; j++) {
			this.data[i][j] = {};
		}
	}

	this.addSprite = function(s, pos) {

	}
}

function SpritSet3D(limit, res) {
	this.gridSize = vBO(function(a,b){return a/b})(limit, res);
	this.data = new Array(res.data[0]);
	for (i=0; i<res.data[0]; i++) {
		this.data[i] = new Array(res.data[1]);
		for (j=0; j<res.data[1]; j++) {
			this.data[i][j] = new Array(res.data[2]);	
		} // TODO all the rest of this
	}
}

