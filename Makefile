# Variables. Yes.
DOCKER=docker
DOCKER_BUILDKIT=1

ORGANISATION=public.ecr.aws/unocha
IMAGE=vrt
VERSION=develop
EXTRAVERSION=-debian-20-chromium
MANIFEST_VERSION=debian-20-chromium-dev

# The main build recipe.
build:  clean
	DOCKER_BUILDKIT=$(DOCKER_BUILDKIT) $(DOCKER) build \
				--build-arg BRANCH_ENVIRONMENT=$(NODE_ENV) \
				--build-arg VCS_REF=`git rev-parse --short HEAD` \
				--build-arg VCS_URL=`git config --get remote.origin.url | sed 's#git@github.com:#https://github.com/#'` \
				--build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
				--build-arg GITHUB_ACTOR=`whoami` \
				--build-arg GITHUB_REPOSITORY=`git config --get remote.origin.url` \
				--build-arg GITHUB_SHA=`git rev-parse --short HEAD` \
				--build-arg VERSION=$(VERSION) \
				--build-arg UPSTREAM=$(UPSTREAM) \
				--tag $(ORGANISATION)/$(IMAGE):$(VERSION)$(EXTRAVERSION) \
		. --file docker/Dockerfile \
		2>&1 | tee buildlog.txt

buildx:	clean
	$(DOCKER) buildx build \
				--no-cache \
				--build-arg BRANCH_ENVIRONMENT=$(NODE_ENV) \
				--build-arg VCS_REF=`git rev-parse --short HEAD` \
				--build-arg VCS_URL=`git config --get remote.origin.url | sed 's#git@github.com:#https://github.com/#'` \
				--build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` \
				--build-arg GITHUB_ACTOR=`whoami` \
				--build-arg GITHUB_REPOSITORY=`git config --get remote.origin.url` \
				--build-arg GITHUB_SHA=`git rev-parse --short HEAD` \
				--build-arg VERSION=$(VERSION) \
				--build-arg UPSTREAM=$(UPSTREAM) \
				--tag $(ORGANISATION)/$(IMAGE):$(VERSION)$(EXTRAVERSION) \
				    --push --platform linux/arm64,linux/amd64 \
		. --file docker/Dockerfile \
		 2>&1 | tee buildxlog.txt

tagx:
	$(DOCKER) buildx imagetools create -t $(ORGANISATION)/$(IMAGE):$(MANIFEST_VERSION) $(ORGANISATION)/$(IMAGE):$(VERSION)$(EXTRAVERSION)

login:
	aws ecr-public get-login-password --region us-east-1 | $(DOCKER) login --username AWS --password-stdin public.ecr.aws/unocha

clean:
	rm -rf ./buildlog.txt buildxlog.txt

# Always build, never claim cache.
.PHONY: build
