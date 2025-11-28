import React, { useState, useEffect, useRef } from 'react';
import './Pomodoro.css';

function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  const modes = {
    work: { duration: 25, label: 'Deep Work' },
    shortBreak: { duration: 5, label: 'Short Break' },
    longBreak: { duration: 15, label: 'Long Break' }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, minutes, seconds]);

  const playSound = () => {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create oscillator for beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Set sound properties (pleasant tone)
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';

    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Play three beeps
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 800;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0, audioContext.currentTime);
      gain2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 200);

    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc3.frequency.value = 1000;
      osc3.type = 'sine';
      gain3.gain.setValueAtTime(0, audioContext.currentTime);
      gain3.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7);
      osc3.start(audioContext.currentTime);
      osc3.stop(audioContext.currentTime + 0.7);
    }, 400);
  };

  const handleTimerComplete = () => {
    setIsActive(false);

    // Play audio alert
    playSound();

    if (mode === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);

      // After 4 pomodoros, suggest long break
      if (newCount % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }

    // Play notification sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to get back to work!',
        icon: '/favicon.ico'
      });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMinutes(modes[newMode].duration);
    setSeconds(0);
    setIsActive(false);
  };

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(modes[mode].duration);
    setSeconds(0);
  };

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = ((modes[mode].duration * 60 - (minutes * 60 + seconds)) / (modes[mode].duration * 60)) * 100;

  return (
    <div className={`pomodoro-widget widget ${mode}`}>
      <h2>Pomodoro Timer</h2>

      <div className="mode-selector">
        <button
          onClick={() => switchMode('work')}
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
        >
          Deep Work
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
        >
          Short Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
        >
          Long Break
        </button>
      </div>

      <div className="timer-display">
        <svg className="progress-ring" width="200" height="200">
          <circle
            className="progress-ring-circle-bg"
            cx="100"
            cy="100"
            r="90"
          />
          <circle
            className="progress-ring-circle"
            cx="100"
            cy="100"
            r="90"
            style={{
              strokeDasharray: `${2 * Math.PI * 90}`,
              strokeDashoffset: `${2 * Math.PI * 90 * (1 - progressPercentage / 100)}`
            }}
          />
        </svg>
        <div className="timer-text">
          <div className="time">{formatTime(minutes, seconds)}</div>
          <div className="mode-label">{modes[mode].label}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button onClick={toggleTimer} className="control-btn start-pause">
          {isActive ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={resetTimer} className="control-btn reset">
          ↻ Reset
        </button>
      </div>

      <div className="pomodoro-stats">
        <div className="stat">
          <span className="stat-value">{completedPomodoros}</span>
          <span className="stat-label">Completed Today</span>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
