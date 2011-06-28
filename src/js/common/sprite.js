// Sprite manipulation

function SpriteSet2D(limit, res) {
	this.gridSize = vBO(function(a,b){return a/b})(limit, res);
	this.data = {}
}

function SpritSet3D(limit, res) {
	this.gridSize = vBO(function(a,b){return a/b})(limit, res);
	this.data = {}
}

