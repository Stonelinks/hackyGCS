import _ from 'lodash';
import React, { Component } from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './App.css';

const websocketAddress = 'ws://' + (process.env.REACT_APP_WSS_PORT ? window.location.hostname + ':' + process.env.REACT_APP_WSS_PORT : window.location.host)
console.log(`websocket address: ${websocketAddress}`);
const client = new WebSocket(websocketAddress)

class App extends Component {

  constructor() {
    super()
    this.state = {
      time_boot_ms: 0,
      stripchartLimit: 350,
      pitch: [0],
      pitchspeed: [0],
      roll: [0],
      rollspeed: [0],
      yaw: [0],
      yawspeed: [0]
    }
  }

  componentDidMount() {
    client.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === "ATTITUDE") {
        const newState = _.clone(this.state)
        for (var k in this.state) {
          var stateItem = this.state[k]
          if (_.isArray(stateItem)) {
            stateItem.push(message.data[k])
            if (stateItem.length > this.state.stripchartLimit) {
              stateItem.shift()
            }
            newState[k] = stateItem
          }
        }
        this.setState(newState)
      }
    }
  }

  get stripcharts() {
    let r = []
    for (var k in this.state) {
      var stateItem = this.state[k]
      if (_.isArray(stateItem)) {
        r.push((
          <div key={k}>
            <code>{k}: {stateItem[stateItem.length - 1]}</code>
            <Sparklines data={stateItem} limit={this.state.stripchartLimit} width={1000} height={70} margin={5}>
              <SparklinesLine color="black" />
            </Sparklines>
          </div>
        ))
      }
    }
    return r
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to fuq</h2>
        </div>
        <p className="App-intro">
        Attitude
        </p>
        {this.stripcharts}
      </div>
    );
  }
}

export default App;
