const { useState, useEffect } = React;
const beep = document.getElementById("beep");

const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());

  return { cancel };  
};

const Timer = () => {
  const [time, setTime] = useState(1500),
    [sessionLength, setSessionLength] = useState(25),
    [breakLength, setBreakLength] = useState(5),
    [isRunning, setIsRunning] = useState(false),
    [interval, updateInterval] = useState(undefined),
    [status, setStatus] = useState("focus");

  useEffect(() => {
    const body = document.body;
    const timerWrapper = document.getElementById("timer-wrapper");

    if (status === "focus") {
      body.style.backgroundColor = "#cd5c5c";
      timerWrapper.style.backgroundColor = "#b22222";
    } else {
      body.style.backgroundColor = "#4f666a";
      timerWrapper.style.backgroundColor = "#2f4f4f";
    }
  }, [status]);

  const play_pause = () => {
    let sec = time;
    let stats = status;

    const countDown = () => {
      sec--;
      setTime(sec);
      if (sec === -1) {
        beep.play();
        if (stats === "focus") {
          setStatus("break");

          stats = "break";
          sec = breakLength * 60;
        } else {
          setStatus("focus");

          stats = "focus";
          sec = sessionLength * 60;
        }
        setTime(sec);
      }
    };

    if (!isRunning) {
      setIsRunning(true);
      updateInterval(accurateInterval(countDown, 1000));
    } else {
      setIsRunning(false);
      interval.cancel();
    }
  };

  const reset = () => {
    if (!beep.paused) {
      beep.pause();
      beep.currentTime = 0;
    }

    if (interval) {
      interval.cancel();
      updateInterval(undefined);
    }

    setSessionLength(25);
    setBreakLength(5);
    setTime(1500);
    setStatus("focus");
    setIsRunning(false);
  };

  const clockify = (secs) => {
    let minutes = Math.floor(secs / 60);
    let seconds = secs - minutes * 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return minutes + ":" + seconds;
  };

  const flex_SpaceAround = {
    display: "flex",
    justifyContent: "space-around"
  };

  return (
    <div id="timer">
      <div id="control-timers">
        <div id="session-label">
          <h1>Focus Length</h1>
          <div style={flex_SpaceAround}>
            <button
              id="session-increment"
              onClick={() => {
                if (sessionLength === 60 || isRunning) return;

                setSessionLength(sessionLength + 1);

                if (status === "focus") {
                  setTime(sessionLength * 60 + 60);
                }
              }}
            >
              <i className="fa-solid fa-arrow-up" />
            </button>
            <p id="session-length">{sessionLength}</p>
            <button
              id="session-decrement"
              onClick={() => {
                if (sessionLength === 1 || isRunning) return;

                setSessionLength(sessionLength - 1);

                if (status === "focus") {
                  setTime(sessionLength * 60 - 60);
                }
              }}
            >
              <i className="fa-solid fa-arrow-down" />
            </button>
          </div>
        </div>

        <div id="break-label">
          <h1>Break Length</h1>
          <div style={flex_SpaceAround}>
            <button
              id="break-increment"
              onClick={() => {
                if (breakLength === 60 || isRunning) return;

                setBreakLength(breakLength + 1);

                if (status === "break") {
                  setTime(breakLength * 60 + 60);
                }
              }}
            >
              <i className="fa-solid fa-arrow-up" />
            </button>
            <p id="break-length">{breakLength}</p>
            <button
              id="break-decrement"
              onClick={() => {
                if (breakLength === 1 || isRunning) return;

                setBreakLength(breakLength - 1);

                if (status === "break") {
                  setTime(breakLength * 60 - 60);
                }
              }}
            >
              <i className="fa-solid fa-arrow-down" />
            </button>
          </div>
        </div>
      </div>

      <div id="timer-wrapper">
        <h1 id="timer-label">{status}</h1>
        <div id="time-left">{clockify(time)}</div>
        <div style={flex_SpaceAround}>
          <button
            title={isRunning ? "Pause" : "Play"}
            id="start_stop"
            onClick={play_pause}
          >
            <i
              className={isRunning ? "fa-solid fa-pause" : "fa-solid fa-play"}
            />
          </button>
          <button title="Reset" id="reset" onClick={reset}>
            <i className="fa-solid fa-rotate" />
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const clicked = (event) => {
    event.target.classList.add("link-clicked");
  };

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
