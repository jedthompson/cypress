COMMON_JSFILES := \
	vector.js

JSFILES := $(wildcard src/js/common/*.js)

MKDIR := mkdir -p

.PHONY: all doc js test clean

all: html js

html: build/html/simulation.html

js: build/js/cypress.js build/js/select.js

build:
	${MKDIR} $@
build/js build/css build/html build/gr: build
	${MKDIR} $@
build/js/cypress.js: build/js ${JSFILES}
	cat ${JSFILES} > $@
build/js/select.js: build/js src/js/select.js
	cp src/js/select.js $@
build/html/simulation.html: build/html src/html/simulation.html
	cp src/html/simulation.html $@

doc:

.SILENT: test
test:
	echo Open tests/index.html in a browser to run unit tests

.SILENT: clean
clean:
	for r in `cat .hgignore`;\
	do find * -regex $$r -exec echo rm -rf \{\} \; -delete;done

