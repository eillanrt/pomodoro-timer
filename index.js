const { useState: state } = React;
const beep = document.getElementById("beep");

const Timer = () => {
  const [time, setTime] = state(1500),
    [isRunning, setIsRunning] = state(false),
    [interval, updateInterval] = state(undefined),
    [sessionLength, setSessionLength] = state(25),
    [breakLength, setBreakLength] = state(5),
    [status, setStatus] = state("session");

  function start_pause(event) {
    let sec = time;
    let stats = status;

    function countDown() {
      sec--;
      setTime(sec);
      if (sec === -1) {
        beep.play();
        if (stats === "session") {
          setStatus("break");

          stats = "break";
          sec = breakLength * 60;
        } else if (stats === "break") {
          setStatus("session");

          stats = "session";
          sec = sessionLength * 60;
        }
        setTime(sec);
      }
    }

    if (!isRunning) {
      setIsRunning(true);
      updateInterval(setInterval(countDown, 1000));
    } else {
      setIsRunning(false);
      clearInterval(interval);
    }
  }

  function reset(event) {
    if (!beep.paused) {
      beep.pause();
      beep.currentTime = 0;
    }

    if (interval !== undefined) {
      clearInterval(interval);
      updateInterval(undefined);
    }

    setSessionLength(25);
    setBreakLength(5);
    setTime(1500);
    setStatus("session");
    setIsRunning(false);
  }

  function clockify() {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return minutes + ":" + seconds;
  }

  return (
    <div id="timer">
      <div id="control-timers">
        <div id="session-label">
          <h1>Session Length</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <button
              id="session-increment"
              onClick={() => {
                if (sessionLength === 60 || isRunning) return;

                setSessionLength(sessionLength + 1);

                if (!isRunning && status === "session") {
                  setTime(sessionLength * 60 + 60);
                }
              }}
            >
              Up
            </button>
            <p id="session-length">{sessionLength}</p>
            <button
              id="session-decrement"
              onClick={() => {
                if (sessionLength === 1 || isRunning) return;

                setSessionLength(sessionLength - 1);

                if (!isRunning && status === "session") {
                  setTime(sessionLength * 60 - 60);
                }
              }}
            >
              Down
            </button>
          </div>
        </div>

        <div id="break-label">
          <h1>Break Length</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <button
              id="break-increment"
              onClick={() => {
                if (breakLength === 60 || isRunning) return;

                setBreakLength(breakLength + 1);

                if (!isRunning && status === "break") {
                  setTime(breakLength * 60 + 60);
                }
              }}
            >
              Up
            </button>
            <p id="break-length">{breakLength}</p>
            <button
              id="break-decrement"
              onClick={() => {
                if (breakLength === 1 || isRunning) return;

                setBreakLength(breakLength - 1);

                if (!isRunning && status === "break") {
                  setTime(breakLength * 60 - 60);
                }
              }}
            >
              Down
            </button>
          </div>
        </div>
      </div>

      <div id="timer-wrapper">
        <h1 id="timer-label">{status}</h1>
        <div id="time-left">{clockify()}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <button
            title={isRunning ? "Pause" : "Play"}
            id="start_stop"
            onClick={start_pause}
          >
            {isRunning ? "Pause" : "Play"}
          </button>
          <button title="Reset" id="reset" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  function clicked(event) {
    event.target.classList.add("link-clicked");
  }

  return (
    <>
      <header>
        <h1>Pomodoro Clock</h1>
      </header>
      <Timer />
      <footer>
        <p>
          Design and Code by
          <br />
          <a
            onClick={clicked}
            href="https://freecodecamp.org/eillan04"
            target="_blank"
          >
            Allan Robert Tan
          </a>
        </p>
      </footer>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
