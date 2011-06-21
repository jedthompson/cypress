COMMON_JSFILES := \
	vector.js

JSFILES_ := $(addprefix common/,${COMMON_JSFILES})
JSFILES := $(addprefix src/js/,${JSFILES_})

.PHONY: all doc js test clean

all: js

js: build/js/cypress.js

build:
	mkdir build
build/js: build
	mkdir build/js
build/js/cypress.js: build/js ${JSFILES}
	cat ${JSFILES} > $@

doc:

test:

clean:
	for r in `cat .hgignore`;do find * -regex $$r -delete;done

