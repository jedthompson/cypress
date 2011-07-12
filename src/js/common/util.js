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
	dist = (e-s)/4;
	for (i=0; i<d; i++) {
		if (p(v)) // move to the left
			v -= dist;
		else // move to the right
			v += dist;
		dist /= 2;
	}
	return v;
}

//TODO Replace with better sort algorithm (probably quicksort)
function sortVectorArrayByX(arr) {
	var array = sortVectorArrayByDimension(arr, 0);
	return array;
}

function sortVectorArrayByY(arr) {
	var array = sortVectorArrayByDimension(arr, 1);
	return array;
}

function sortVectorArrayByDimension(arr, num) {
	var array = arr;
	for(var i = 0; i < array.length; i++) {
		for(var j = 0; j < array.length-1; j++) {
			if(array[j+1].data[num] < array[j].data[num]) {
				var temp = array[j+1];
				array[j+1] = array[j];
				array[j] = temp;
			}
		}
	}
	return array;
}

