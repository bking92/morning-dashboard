import React, { useState, useEffect } from 'react';
import './Quote.css';

function Quote() {
  const [todayGoal, setTodayGoal] = useState('');
  const [category, setCategory] = useState('work');
  const [goals, setGoals] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedGoals = localStorage.getItem('dailyGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    // Check if there's a goal for today
    const today = new Date().toDateString();
    const todayGoalData = JSON.parse(savedGoals || '[]').find(g => g.date === today);
    if (todayGoalData) {
      setTodayGoal(todayGoalData.goal);
      setCategory(todayGoalData.category);
    }
  }, []);

  const saveGoal = () => {
    if (!todayGoal.trim()) return;

    const today = new Date().toDateString();
    const newGoal = {
      date: today,
      goal: todayGoal,
      category: category,
      completed: false
    };

    // Remove any existing goal for today and add the new one
    const updatedGoals = goals.filter(g => g.date !== today);
    updatedGoals.unshift(newGoal);

    setGoals(updatedGoals);
    localStorage.setItem('dailyGoals', JSON.stringify(updatedGoals));
    setTodayGoal(''); // Clear the input after saving
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveGoal();
    }
  };

  const toggleComplete = (date) => {
    const updatedGoals = goals.map(g =>
      g.date === date ? { ...g, completed: !g.completed } : g
    );
    setGoals(updatedGoals);
    localStorage.setItem('dailyGoals', JSON.stringify(updatedGoals));
  };

  const getCategoryStats = () => {
    const stats = {
      fitness: 0,
      work: 0,
      family: 0,
      other: 0
    };
    goals.forEach(g => {
      if (stats[g.category] !== undefined) {
        stats[g.category]++;
      }
    });
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="quote-widget widget">
      <h2>One Important Thing</h2>
      <div className="goal-input-section">
        <textarea
          value={todayGoal}
          onChange={(e) => setTodayGoal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's your one important thing today?"
          className="goal-input"
          rows="3"
        />
        <div className="category-selector">
          <label>Category:</label>
          <div className="category-buttons">
            {['work', 'fitness', 'family', 'other'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-btn ${category === cat ? 'active' : ''} ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button onClick={saveGoal} className="save-goal-btn">
          Save Goal
        </button>
      </div>

      <div className="goal-stats">
        <div className="stat-item">
          <span className="stat-label">Work</span>
          <span className="stat-value">{stats.work}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Fitness</span>
          <span className="stat-value">{stats.fitness}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Family</span>
          <span className="stat-value">{stats.family}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Other</span>
          <span className="stat-value">{stats.other}</span>
        </div>
      </div>

      <button
        onClick={() => setShowHistory(!showHistory)}
        className="toggle-history-btn"
      >
        {showHistory ? '↑ Hide History' : '↓ View History'}
      </button>

      {showHistory && (
        <div className="goal-history">
          {goals.slice(0, 10).map((g, index) => (
            <div key={index} className={`history-item ${g.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={g.completed}
                onChange={() => toggleComplete(g.date)}
                className="goal-checkbox"
              />
              <div className="history-content">
                <p className="history-goal">{g.goal}</p>
                <div className="history-meta">
                  <span className={`category-badge ${g.category}`}>{g.category}</span>
                  <span className="history-date">{g.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quote;
