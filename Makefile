JSCOMMON := $(wildcard src/js/common/*.js)
SIMULATIONCATS := $(subst src/js/simulations/,,$(wildcard src/js/simulations/*))
JSSIMULATIONS := $(wildcard src/js/simulations/*/*.js)

OUT_SIMDIRS := $(foreach sim,${SIMULATIONCATS},build/js/simulations/${sim}/)
OUT_JSSIMULATIONS := $(subst src/js/simulations,build/js/simulations,${JSSIMULATIONS})

MKDIR := mkdir -p

.PHONY: all doc js test clean

all: html js

html: build/html/simulation.html

js: build/js/cypress.js build/js/select.js ${OUT_JSSIMULATIONS}

build:
	${MKDIR} $@
build/js build/css build/html build/gr: build
	${MKDIR} $@
build/js/cypress.js: build/js ${JSCOMMON}
	cat ${JSCOMMON} > $@
build/js/select.js: build/js src/js/select.js
	cp src/js/select.js $@
build/html/simulation.html: build/html src/html/simulation.html
	cp src/html/simulation.html $@

build/js/simulations: build/js
	${MKDIR} $@
${OUT_SIMDIRS}: build/js/simulations
	${MKDIR} $@
${OUT_JSSIMULATIONS}: ${OUT_SIMDIRS} ${JSSIMULATIONS}
	cp $(subst build/js/simulations,src/js/simulations,$@) $@

doc:

.SILENT: test
test:
	echo Open tests/index.html in a browser to run unit tests

.SILENT: clean
clean:
	for r in `cat .hgignore`;\
	do find * -regex $$r -exec echo rm -rf \{\} \; -delete;done

