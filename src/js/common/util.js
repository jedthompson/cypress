function curry(fn) {
        var slice = Array.prototype.slice;
        var args = slice.apply(arguments, [1]);
        return function () {
                return fn.apply(null, args.concat(slice.apply(arguments)));
        };
}

// Performs binary search, on the assumption that p(v) is false on the left and
// true on the right.
function binarySearch(p, d, s, e) {
	v = (s+e)/2;
	dst = (e-s)/4;
	for (i=0; i<d; i++) {
		if (p(v)) // move to the left
			v -= dst;
		else // move to the right
			v += dst;
		dst /= 2;
	}
	return v;
}

