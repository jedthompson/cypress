COMMON_JSFILES := \
	vector.js

JSFILES_ := $(addprefix common/,${COMMON_JSFILES})
JSFILES := $(addprefix src/js/,${JSFILES_})

MKDIR := mkdir -p

.PHONY: all doc js test clean

all: html js

html: build/html/simulation.html

js: build/js/cypress.js build/js/select.js

build:
	${MKDIR} build
build/js: build
	${MKDIR} build/js
build/js/cypress.js: build/js ${JSFILES}
	cat ${JSFILES} > $@
build/js/select.js: build/js src/js/select.js
	cp src/js/select.js $@
build/html: build
	${MKDIR} build/html
build/html/simulation.html: build/html src/html/simulation.html
	cp src/html/simulation.html $@

doc:

.SILENT: test
test:
	echo Open tests/index.html in a browser to run unit tests

.SILENT: clean
clean:
	for r in `cat .hgignore`;do find * -regex $$r -exec echo rm -rf \{\} \; -delete;done

