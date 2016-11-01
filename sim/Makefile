PX4_DIR := PX4
PX4_GIT := git@github.com:PX4/Firmware.git

# SIM_TARGET := gazebo
SIM_TARGET := jmavsim

.PHONY: clean fetch sim

all: sim

clean:
	cd ${PX4_DIR} && \
	git reset --hard HEAD && \
	make clean

fetch:
	if [ -d ${PX4_DIR} ]; then \
		cd ${PX4_DIR} && \
		git pull origin master; \
	else \
		git clone ${PX4_GIT} ${PX4_DIR}; \
	fi
	cd ${PX4_DIR} && \
	git submodule update --init --recursive

sim:
	cd ${PX4_DIR} && \
	${MAKE} posix_sitl_default ${SIM_TARGET}
