# Makefile for Cypress

#JSCOMMONNAMES := vector graphics runner simulation util
#JSCOMMON := $(foreach n,${JSCOMMONNAMES},src/js/common/${n}.js)
JSCOMMON := $(shell find src/js/common -type f -regex .*\.js)
JSSIMULATIONS := $(wildcard src/js/simulations/*/*/*.js)
OUT_JSSIMULATIONS := $(subst src/js/,build/js/,${JSSIMULATIONS})

SRC_GR := $(shell find src/gr -type f)
OUT_GR := $(subst src/gr,build/gr,${SRC_GR})

SRC_CSS := $(wildcard src/css/*.css)
OUT_CSS := $(subst src/css,build/css,${SRC_CSS})

SRC_DATA := $(wildcard src/data/*)
OUT_DATA := $(subst src/data,build/data,${SRC_DATA})

TESTS := $(shell find tests -type f)
OUT_TESTS := $(foreach t,${TESTS},build/${t})
TEST_DIRS := $(shell find tests -type d)
OUT_TEST_DIRS := $(foreach t,${TEST_DIRS},build/${t})

MKDIR := @mkdir -p
XSLTPROC := xsltproc
CP := @cp

.PHONY: all doc js test tests clean

all: html js css gr data tests

tests: ${OUT_TESTS}
${OUT_TESTS}:
	${MKDIR} $(shell dirname $@)
	${CP} $(subst build/,,$@) $@

html: build/html/simulation.html

js: build/js/cypress.js build/js/select.js ${OUT_JSSIMULATIONS}

data: ${OUT_DATA} build/html/simulations.xhtml
${OUT_DATA}: ${SRC_DATA}
	${MKDIR} build/data
	${CP} $(subst build/data,src/data,$@) $@
build/html/simulations.xhtml: $(subst src/data,build/data,$(wildcard src/data/simulations.*))
	${XSLTPROC} build/data/simulations.xsl build/data/simulations.xml > build/html/simulations.xhtml

css: ${OUT_CSS}
${OUT_CSS}: ${SRC_CSS}
	${MKDIR} build/css
	${CP} $(subst build/css,src/css,$@) $@

gr: ${OUT_GR}
${OUT_GR}: ${SRC_GR}
	${MKDIR} $(shell dirname $@)
	${CP} $(subst build/gr,src/gr,$@) $@

build/js/cypress.js: ${JSCOMMON}
	${MKDIR} build/js
	cat ${JSCOMMON} > $@
build/js/select.js: src/js/select.js
	${MKDIR} build/js
	${CP} src/js/select.js $@
build/html/simulation.html: src/html/simulation.html
	${MKDIR} build/html
	${CP} src/html/simulation.html $@

build/js/simulations:
	${MKDIR} build/js
	${MKDIR} $@
${OUT_SIMDIRS}: build/js/simulations
	${MKDIR} build/js
	${MKDIR} $@
${OUT_JSSIMULATIONS}: ${JSSIMULATIONS}
	${MKDIR} $(shell dirname $@)
	${CP} $(subst build/js/simulations,src/js/simulations,$@) $@

doc:

test: tests
	@echo Open tests/index.html in a browser to run unit tests

.SILENT: clean
clean:
	for r in `cat .hgignore`;\
	do find * -regex $$r -delete;done

