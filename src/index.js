import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleDown,
  faArrowCircleUp,
  faPlay,
  faPause,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      on: false,
      breakLength: 5 * 60,
      sessionLength: 25 * 60,
      count: 25 * 60,
      icon: faPlay,
      displayMode: "Session"
    };

    this.incBreakLength = this.incBreakLength.bind(this);
    this.decBreakLength = this.decBreakLength.bind(this);
    this.incSessionLength = this.incSessionLength.bind(this);
    this.decSessionLength = this.decSessionLength.bind(this);
    this.handleClock = this.handleClock.bind(this);
    this.resetClock = this.resetClock.bind(this);
    this.timer = this.timer.bind(this);
  }

  incBreakLength() {
    if (this.state.sessionLength === 3600 || this.state.on)
      return;
    this.setState({breakLength: this.state.breakLength + 60});
  }

  decBreakLength() {
    if (this.state.breakLength === 60 || this.state.on)
      return;
    this.setState({breakLength: this.state.breakLength - 60});
  }

  incSessionLength() {
    if (this.state.sessionLength === 3600 || this.state.on)
      return;
    let newLength = this.state.sessionLength + 60;
    this.setState({
      sessionLength: newLength,
      count: newLength
    });
  }

  decSessionLength() {
    if (this.state.sessionLength === 60 || this.state.on)
      return;
    let newLength = this.state.sessionLength - 60;
    this.setState({
      sessionLength: newLength,
      count: newLength
    });
  }

  timer(){
    var app = this;
    let beep = document.getElementById("beep");
    let sessionTimerId = setInterval(function(){
        if (app.state.on === false)
        {
          clearInterval(sessionTimerId);
          return;
        }
        app.setState({ count: app.state.count - 1 });
        if (app.state.count === 0)
          beep.play();
        if (app.state.count === -1){
          if (app.state.displayMode === "Session")
            app.setState({
              displayMode : "Break",
              count : app.state.breakLength
            });
          else
            app.setState({
              displayMode : "Session",
              count : app.state.sessionLength
            });
        }
      }, 1000);
  }

  handleClock(){
    let beep = document.getElementById("beep");
    this.setState({ on: !(this.state.on)});
    if (this.state.on === false)
    {
      beep.pause();
      beep.currentTime = 0;
    }
    this.setState({ icon: this.state.on ? faPlay : faPause });
    this.timer();
  }
  
  resetClock() {
    let beep = document.getElementById("beep");
    this.setState({
      on: false,
      count: 25 * 60,
      breakLength: 5 * 60,
      sessionLength: 25 * 60,
      icon: faPlay,
      displayMode: "Session"
    });
    beep.stop();
    console.log(beep.stop);
    beep.currentTime = 0;
  }

  render() {
    return (
      <div className="app">
        <div className="settings">
          <div className="break">
            <p className="break-label" id="break-label">
              Break Length
            </p>
            <FontAwesomeIcon
              className="decrement"
              onClick={this.decBreakLength}
              id="break-decrement"
              icon={faArrowCircleDown}
            />
            <span className="visual" id="break-length">{this.state.breakLength / 60}</span>
            <FontAwesomeIcon
              className="increment"
              onClick={this.incBreakLength}
              id="break-increment"
              icon={faArrowCircleUp}
            />
          </div>

          <div className="session">
            <p className="session-label" id="session-label">
              Session Length
            </p>
            <FontAwesomeIcon
              className="decrement"
              onClick={this.decSessionLength}
              id="session-decrement"
              icon={faArrowCircleDown}
            />
            <span className="visual" id="session-length">{this.state.sessionLength / 60}</span>
            <FontAwesomeIcon
              className="increment"
              onClick={this.incSessionLength}
              id="session-increment"
              icon={faArrowCircleUp}
            />
          </div>
        </div>

        <div className="display">
          <p id="timer-label">{this.state.displayMode}</p>
          <p id="time-left">
          {`
            ${Math.floor(this.state.count / 60) >= 10 ? Math.floor(this.state.count / 60) : "0" + Math.floor(this.state.count / 60)} : ${this.state.count % 60 < 10 ? "0" + this.state.count % 60: this.state.count % 60}
          `}
          </p>
        </div>

        <div className="controls">
          <FontAwesomeIcon
            className="start_stop"
            onClick={this.handleClock}
            id="start_stop"
            icon={this.state.icon}
          />
          <FontAwesomeIcon
            className="reset"
            id="reset"
            onClick={this.resetClock}
            icon={faSyncAlt}
          />
          <audio id="beep" src="http://www.peter-weinberg.com/files/1014/8073/6015/BeepSound.wav"/>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Clock />, rootElement);
