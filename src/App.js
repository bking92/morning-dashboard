import React from 'react';
import './App.css';
import DateTime from './components/DateTime';
import Weather from './components/Weather';
import News from './components/News';
import TodoList from './components/TodoList';
import Quote from './components/Quote';
import RedditThreads from './components/RedditThreads';
import Pomodoro from './components/Pomodoro';
import WaterTracker from './components/WaterTracker';
import MarketIndices from './components/MarketIndices';
import DailyBoosts from './components/DailyBoosts';

function App() {
  return (
    <div className="App">
      <div className="dashboard-container">
        <div className="top-ribbon">
          <DateTime />
          <Weather />
          <MarketIndices />
        </div>

        <div className="content-grid">
          <div className="left-column">
            <Quote />
            <Pomodoro />
            <WaterTracker />
            <TodoList />
          </div>

          <div className="right-column">
            <DailyBoosts />
            <News />
            <RedditThreads />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
