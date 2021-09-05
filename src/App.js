import React from 'react';
import './App.css';

const audio = document.getElementById('beep');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false
    }
    this.loop = undefined;
  }

  componentWillUnmount = () => {
    clearInterval(this.loop);
  }

  handlePlayPause = () => {
    const { isPlaying } = this.state;

    if(isPlaying) {
      clearInterval(this.loop);

      this.setState({
        isPlaying: false
      });
    } else {
      this.loop = setInterval(() => {
        const { clockCount,
                currentTimer,
                breakCount,
                sessionCount
              } = this.state;

        if(clockCount === 0) {
          this.setState({
            currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',
            clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
          });
          audio.play();
          
        } else {
          this.setState({
            clockCount: clockCount - 1
          });
        }
      }, 1000);

      this.setState({
        isPlaying: true
      });
    }
    }

  handleReset = () => {
    this.setState({
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying: false
    });
    clearInterval(this.loop);

    audio.pause();
    audio.currentTime = 0;
  }

  handleLengthChange = (count, timerType) => {
    const { 
      sessionCount,
      breakCount,
      isPlaying,
      currentTimer
    } = this.state;

      let newCount;

      if(timerType === 'session') {
        newCount = sessionCount + count;
      } else {
        newCount = breakCount + count;
      }

      if(newCount > 0 && newCount < 61 && !isPlaying) {
          this.setState({
            [`${timerType}Count`]: newCount
          });
          if(currentTimer.toLowerCase() === timerType) {
            this.setState({
              clockCount: newCount * 60
            })
          }
      }
  }

  convertToTime = (count) => {
    let minutes = Math.floor(count / 60);
    let seconds = count % 60;

    seconds = seconds < 10 ? ('0'+seconds) : seconds;
    minutes = minutes < 10 ? ('0'+minutes) : minutes;

    return `${minutes}:${seconds}`;
  }

  render = () => {
    const {
      breakCount,
      sessionCount,
      clockCount,
      currentTimer,
      isPlaying
    } = this.state;

    const breakProps = {
      title: 'Break',
      count: breakCount,
      handleDecrease: () => this.handleLengthChange(-1, 'break'),
      handleIncrease: () => this.handleLengthChange(1, 'break'),
    }
    const sessionProps = {
      title: 'Session',
      count: sessionCount,
      handleDecrease: () => this.handleLengthChange(-1, 'session'),
      handleIncrease: () => this.handleLengthChange(1, 'session'),
    }
    return (
      <div>
        <div className="flex">
          <SetTimer {...breakProps} />
          <SetTimer {...sessionProps} />
        </div>
        <div className="clock-container">
          <div className="timer-wrapper">
            <h1 id="timer-label">{currentTimer}</h1>
            <span id="time-left">{this.convertToTime(clockCount)}</span>
          </div>
          <div className="flex">
            <button id="start_stop" onClick={this.handlePlayPause}><i className={`fas fa-${isPlaying ? 'pause' : 'play'}-circle`} /></button>
            <button id="reset" onClick={this.handleReset}><i class="fas fa-sync-alt"></i></button>
          </div>
        </div>
      </div>
    );
  } 
}


const SetTimer = (props) => {
  const id = props.title.toLowerCase();
  return (
    <div className="container">
      <h2 id={`${id}-label`}>{props.title} Length</h2>
      <div className="flex wrapper">
        <button id={`${id}-decrement`} onClick={props.handleDecrease}><i class="fas fa-minus-circle" /></button>
        <span id={`${id}-length`}>{props.count}</span>
        <button id={`${id}-increment`} onClick={props.handleIncrease}><i class="fas fa-plus-circle" /></button>
      </div>
    </div>
);
  }
export default App;
