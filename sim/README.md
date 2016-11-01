# Simulation Utilities

## PX4

### Setup

#### OS X only

```sh
brew update
brew cask install java
brew install cmake ant
```
#### All platforms

Outside of any venv:
```sh
pip install empy catkin_pkg
```

### Fetch the sim
```sh
make fetch
```

### Run the sim
```sh
make sim
```

### If you run into problems
```sh
make clean
```
The PX4 docs are also a great resource: http://dev.px4.io/starting-installing.html
