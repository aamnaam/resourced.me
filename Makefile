build-dev:
	cd frontend && $(MAKE) build-dev
	cd backend && $(MAKE) build
run-dev:
	ENV=dev docker-compose \
	-f docker-compose-dev.yaml \
	up

build-production:
	cd frontend && $(MAKE) build-production
	cd backend && $(MAKE) build

run-production:
	ENV=prod docker-compose \
	-f docker-compose-prod.yaml \
	up -d