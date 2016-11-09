# Simulation Utilities

This is a Makefile that allows easy interaction of the PX4 software sim via docker.

## Setup

Make sure you have docker installed for your platform

### OS X

**XQuartz**

You need to install and start [XQuartz](https://www.xquartz.org/). This is so it is possible to use the sim's GUI from the container.

```sh
brew cask install xquartz
```

Some default settings need to be changed
```sh
defaults write org.macosforge.xquartz.X11 enable_iglx -bool true
defaults write org.macosforge.xquartz.X11 nolisten_tcp -bool false
```

Now log out and back in to OS X.

## Fetch / update PX4
```sh
make fetch
```

## Build and run the sim

This will start PX4 and the sim in the container and connect to a local X session. For more info, read [this](http://dev.px4.io/advanced-docker.html).
```sh
make sim
```

## If your container gets stuck
```sh
make kill-containers
```

## If you want to rebuild or run into problems
```sh
make clean
```

The PX4 docs are also a great resource: http://dev.px4.io/starting-installing.html
