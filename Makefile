JSCOMMON := $(shell find src/js/common -type f -regex .*\.js)
SIMULATIONCATS := $(subst src/js/simulations/,,$(wildcard src/js/simulations/*))
JSSIMULATIONS := $(wildcard src/js/simulations/*/*.js)

OUT_SIMDIRS := $(foreach sim,${SIMULATIONCATS},build/js/simulations/${sim}/)
OUT_JSSIMULATIONS := $(subst src/js/simulations,build/js/simulations,${JSSIMULATIONS})

SRC_GR := $(wildcard src/gr/*.gr)
OUT_GR := $(subst src/gr,build/gr,${SRC_GR})

SRC_CSS := $(wildcard src/css/*.css)
OUT_CSS := $(subst src/css,build/css,${SRC_CSS})

TESTS := $(shell find tests -type f)
OUT_TESTS := $(foreach t,${TESTS},build/${t})
TEST_DIRS := $(shell find tests -type d)
OUT_TEST_DIRS := $(foreach t,${TEST_DIRS},build/${t})

MKDIR := @mkdir -p

.PHONY: all doc js test tests clean

all: html js css gr tests

tests: ${OUT_TESTS}
${OUT_TESTS}: build/tests
	${MKDIR} $(shell dirname $@)
	cp $(subst build/,,$@) $@

html: build/html/simulation.html

js: build/js/cypress.js build/js/select.js ${OUT_JSSIMULATIONS}

css: ${OUT_CSS}

${OUT_CSS}: build/css ${SRC_CSS}
	cp $(subst build/css,src/css,$@) $@

gr: ${OUT_GR}

${OUT_GR}: build/gr
	cp $(subst build/gr,src/gr,$@) $@

build:
	${MKDIR} $@
build/js build/css build/html build/gr build/tests: build
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
test: tests
	echo Open tests/index.html in a browser to run unit tests

.SILENT: clean
clean:
	for r in `cat .hgignore`;\
	do find * -regex $$r -exec echo rm -rf \{\} \; -delete;done

