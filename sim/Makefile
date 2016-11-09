PX4_DIR := PX4
PX4_GIT := git@github.com:PX4/Firmware.git
PX4_BRANCH := master
PX4_DOCKER := px4io/px4-dev
PX4_CONTAINER_NAME := px4-sim

# SIM_TARGET := gazebo
SIM_TARGET := jmavsim

UNAME := $(shell uname)

.PHONY: clean kill-containers fetch sim

all: fetch sim

clean: kill-containers
	cd ${PX4_DIR} && \
	git reset --hard HEAD

kill-containers:
	docker stop ${PX4_CONTAINER_NAME} 2>/dev/null; true
	docker rm ${PX4_CONTAINER_NAME} 2>/dev/null; true

fetch:
	if [ ! -d ${PX4_DIR} ]; then \
		git clone ${PX4_GIT} ${PX4_DIR}; \
	fi
	cd ${PX4_DIR} && \
	git checkout ${PX4_BRANCH} && \
	git pull origin ${PX4_BRANCH} && \
	git submodule update --init --recursive

sim: kill-containers
	if [ ${UNAME} = Darwin ]; then \
		IP_ADDR=$(shell ifconfig en0 | grep inet | awk '$$1=="inet" {print $$2}'); \
		xhost + $$IP_ADDR; \
		SIM_DISPLAY="$$IP_ADDR:0"; \
	else \
		xhost +; \
		SIM_DISPLAY=$$DISPLAY; \
	fi; \
	docker run -it --privileged \
		-v "$(shell pwd)/${PX4_DIR}":/${PX4_DIR}:rw \
		-v /tmp/.X11-unix:/tmp/.X11-unix:ro \
		-e JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF8 \
		-e DISPLAY=$$SIM_DISPLAY \
		-p 14556:14556/udp \
		-p 14550:14550/udp \
		--name=${PX4_CONTAINER_NAME} \
		${PX4_DOCKER} \
		bash -c "cd /${PX4_DIR}; make posix_sitl_default ${SIM_TARGET}"
