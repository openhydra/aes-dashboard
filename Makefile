REGISTRY ?= registry.cn-shanghai.aliyuncs.com
TAG ?=

IMAGETAG ?= $(shell git rev-parse --abbrev-ref HEAD)-$(shell git rev-parse --verify HEAD)-$(shell date -u '+%Y%m%d%I%M%S')
COMMIT_REF ?= $(shell git rev-parse --verify HEAD)
BRANCH ?= $(shell git branch --show-current)

TAG ?=
ifeq ($(TAG),)
	TAG = $(COMMIT_REF)
endif

.PHONY: image
image:
	docker build -t $(REGISTRY)/aes/aes-dashboard:$(IMAGETAG) .

.PHONY: image-then-push
image-then-push:
	docker build -t $(REGISTRY)/aes/aes-dashboard:$(IMAGETAG) .
	docker tag $(REGISTRY)/aes/aes-dashboard:$(IMAGETAG) $(REGISTRY)/aes/aes-dashboard:$(BRANCH)
	docker push $(REGISTRY)/aes/aes-dashboard:$(IMAGETAG)
	docker push $(REGISTRY)/aes/aes-dashboard:$(BRANCH)
