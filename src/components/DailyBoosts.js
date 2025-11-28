import React, { useState, useEffect } from 'react';
import './DailyBoosts.css';

function DailyBoosts() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [showManager, setShowManager] = useState(false);
  const [taskBank, setTaskBank] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskWeight, setNewTaskWeight] = useState(3);

  // Default task bank
  const defaultTasks = [
    { id: '1', text: 'Spend focused 15 mins playing with the kids', weight: 5 },
    { id: '2', text: 'Make one extra client outreach today', weight: 4 },
    { id: '3', text: 'Reorganize part of your closet or desk', weight: 2 },
    { id: '4', text: 'Do 10 mins of stretching or mobility work', weight: 3 },
    { id: '5', text: 'Read for 20 minutes (non-work)', weight: 3 },
    { id: '6', text: 'Clear out your email inbox to zero', weight: 3 },
    { id: '7', text: 'Make progress on one home repair/improvement', weight: 2 },
    { id: '8', text: 'Call or text someone you haven\'t talked to recently', weight: 2 },
    { id: '9', text: 'Plan tomorrow evening in advance', weight: 4 },
    { id: '10', text: 'Review and update your financial tracking', weight: 3 },
    { id: '11', text: 'Spend 15 mins learning something new', weight: 3 },
    { id: '12', text: 'Do one thing that future-you will thank you for', weight: 4 }
  ];

  useEffect(() => {
    // Load task bank
    const savedBank = localStorage.getItem('dailyBoostsBank');
    if (savedBank) {
      setTaskBank(JSON.parse(savedBank));
    } else {
      setTaskBank(defaultTasks);
      localStorage.setItem('dailyBoostsBank', JSON.stringify(defaultTasks));
    }

    // Load or generate daily tasks
    const today = new Date().toDateString();
    const savedDaily = localStorage.getItem('dailyBoostsTasks');

    if (savedDaily) {
      const dailyData = JSON.parse(savedDaily);
      if (dailyData.date === today) {
        setDailyTasks(dailyData.tasks);
        return;
      }
    }

    // Generate new tasks for today
    generateDailyTasks(savedBank ? JSON.parse(savedBank) : defaultTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDailyTasks = (bank) => {
    // Weighted random selection
    const numTasks = Math.random() < 0.5 ? 2 : 3; // 50% chance of 2 or 3 tasks
    const selected = [];
    const bankCopy = [...bank];

    for (let i = 0; i < numTasks && bankCopy.length > 0; i++) {
      const totalWeight = bankCopy.reduce((sum, task) => sum + task.weight, 0);
      let random = Math.random() * totalWeight;

      let selectedIndex = 0;
      for (let j = 0; j < bankCopy.length; j++) {
        random -= bankCopy[j].weight;
        if (random <= 0) {
          selectedIndex = j;
          break;
        }
      }

      selected.push({
        id: bankCopy[selectedIndex].id,
        text: bankCopy[selectedIndex].text,
        completed: false
      });
      bankCopy.splice(selectedIndex, 1);
    }

    const today = new Date().toDateString();
    const dailyData = { date: today, tasks: selected };

    setDailyTasks(selected);
    localStorage.setItem('dailyBoostsTasks', JSON.stringify(dailyData));
  };

  const toggleTask = (taskId) => {
    const updated = dailyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setDailyTasks(updated);

    const today = new Date().toDateString();
    localStorage.setItem('dailyBoostsTasks', JSON.stringify({ date: today, tasks: updated }));
  };

  const rerollTasks = () => {
    generateDailyTasks(taskBank);
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
      weight: newTaskWeight
    };

    const updated = [...taskBank, newTask];
    setTaskBank(updated);
    localStorage.setItem('dailyBoostsBank', JSON.stringify(updated));
    setNewTaskText('');
    setNewTaskWeight(3);
  };

  const deleteTask = (taskId) => {
    const updated = taskBank.filter(t => t.id !== taskId);
    setTaskBank(updated);
    localStorage.setItem('dailyBoostsBank', JSON.stringify(updated));
  };

  const completedCount = dailyTasks.filter(t => t.completed).length;

  return (
    <div className="daily-boosts widget">
      <div className="boosts-header">
        <h2>Daily Boosts</h2>
        <div className="boosts-controls">
          <button onClick={rerollTasks} className="reroll-btn" title="Get different tasks">↻</button>
          <button onClick={() => setShowManager(!showManager)} className="manage-btn">
            {showManager ? '✓' : '⚙'}
          </button>
        </div>
      </div>

      {!showManager ? (
        <>
          <div className="daily-tasks">
            {dailyTasks.map(task => (
              <div key={task.id} className={`boost-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="boost-checkbox"
                />
                <span className="boost-text">{task.text}</span>
              </div>
            ))}
          </div>
          <div className="boost-progress">
            {completedCount} of {dailyTasks.length} completed
          </div>
        </>
      ) : (
        <div className="task-manager">
          <div className="add-task-section">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="New boost task..."
              className="task-input"
            />
            <div className="weight-selector">
              <label>Priority: </label>
              <select value={newTaskWeight} onChange={(e) => setNewTaskWeight(Number(e.target.value))}>
                <option value={1}>1 - Low</option>
                <option value={2}>2</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4</option>
                <option value={5}>5 - High</option>
              </select>
            </div>
            <button onClick={addTask} className="add-task-btn">Add Task</button>
          </div>

          <div className="task-bank-list">
            {taskBank.map(task => (
              <div key={task.id} className="bank-item">
                <span className="bank-weight">P{task.weight}</span>
                <span className="bank-text">{task.text}</span>
                <button onClick={() => deleteTask(task.id)} className="delete-btn">×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyBoosts;
