.PHONY: test install dev build clean

test:
	npm run test:run

install:
	npm install

dev:
	npm run dev

build:
	npm run build

clean:
	rm -rf dist node_modules

lint:
	npm run lint

typecheck:
	npm run typecheck