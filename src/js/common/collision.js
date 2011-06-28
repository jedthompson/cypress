// Collision detection

// Collision predicate for two spheres
function collisionP_SS(r1, p1, v1, r2, p2, v2) {
	return (function(dist, r1, p1, v1, r2, p2, v2) {
		return function(t) {
			pos1 = addV(p1, v1.scale(t));
			pos2 = addV(p2, v2.scale(t));
			return dist(pos1, pos2) <= r1+r2;
		}
	})(dist, r1, p1, v1, r2, p2, v2);
}

