// Test framework for cypress

function Suite(name, tests) {
	this.tests = tests;
	this.name = name;
}

var suites = [];

