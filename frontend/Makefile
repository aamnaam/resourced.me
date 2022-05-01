build-dev:
	docker build \
	-t react-app \
	--build-arg ENV=dev .

run:
	docker run -dp 3000:3000 react-app

build-production:
	docker build \
	-t react-app-production \
	--build-arg CADDYFILE=./Caddyfile \
	--build-arg ENV=prod \
	-f Dockerfile.production .