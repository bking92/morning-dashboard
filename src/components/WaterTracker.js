import React, { useState, useEffect } from 'react';
import './WaterTracker.css';

function WaterTracker() {
  const [glasses, setGlasses] = useState(0);
  const dailyGoal = 8;

  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('waterTracker');

    if (savedData) {
      const { date, count } = JSON.parse(savedData);
      if (date === today) {
        setGlasses(count);
      } else {
        // New day, reset counter
        setGlasses(0);
        localStorage.setItem('waterTracker', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('waterTracker', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  const addGlass = () => {
    const newCount = glasses + 1;
    setGlasses(newCount);
    const today = new Date().toDateString();
    localStorage.setItem('waterTracker', JSON.stringify({ date: today, count: newCount }));
  };

  const removeGlass = () => {
    if (glasses > 0) {
      const newCount = glasses - 1;
      setGlasses(newCount);
      const today = new Date().toDateString();
      localStorage.setItem('waterTracker', JSON.stringify({ date: today, count: newCount }));
    }
  };

  const percentage = Math.min((glasses / dailyGoal) * 100, 100);

  return (
    <div className="water-tracker widget">
      <h2>Water Tracker</h2>
      <div className="water-content">
        <div className="water-display">
          <div className="water-icon">💧</div>
          <div className="water-count">
            <span className="glasses-count">{glasses}</span>
            <span className="glasses-goal">/ {dailyGoal} glasses</span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="water-controls">
          <button onClick={removeGlass} className="water-btn minus" disabled={glasses === 0}>
            −
          </button>
          <button onClick={addGlass} className="water-btn plus">
            +
          </button>
        </div>

        {glasses >= dailyGoal && (
          <div className="goal-achieved">
            🎉 Daily goal achieved!
          </div>
        )}
      </div>
    </div>
  );
}

export default WaterTracker;
