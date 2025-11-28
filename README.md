# Morning Dashboard

A sleek and modern morning dashboard to start your day right! This React app displays the current time, weather, news headlines, inspirational quotes, a to-do list, and top Reddit threads from your favorite Bay Area sports teams.

## Features

- **Date & Time**: Compact live updating clock in top ribbon
- **Weather**: Real-time weather based on your location (using Open-Meteo API - no key required)
- **One Important Thing**: Daily goal tracker with categories (work, fitness, family, other) and history
- **Pomodoro Timer**: Deep work timer with audio alerts (25-min work, 5-min break, 15-min long break)
- **News Links**: Quick access to WSJ, Financial Times, and RealClear Markets
- **To-Do List**: Manage your daily tasks (saved in browser storage)
- **Bay Area Sports**: Top 3 non-thread Reddit posts from SF 49ers, SF Giants, and GS Warriors

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys (optional - weather works without them):

```
REACT_APP_WEATHER_API_KEY=your_key_here_if_switching_to_openweathermap
REACT_APP_NEWS_API_KEY=your_key_here_if_using_news_api
```

**Note:**
- Weather uses Open-Meteo (no API key required)
- News section shows links only (no API key needed)
- Reddit threads use Reddit's public JSON API (no key needed)

The `.env` file is already in `.gitignore` to keep your keys secure.

### 3. Run the App

```bash
npm start
```

The dashboard will open at http://localhost:3000

### 4. Enable Location Services

When you first open the app, your browser will ask for location permission. Click "Allow" to enable weather based on your location.

## Customization

### Change Sports Teams

To customize the Reddit sports feeds:

1. Open `src/components/RedditThreads.js`
2. Modify the `subreddits` array with your preferred teams:

```javascript
const subreddits = [
  { name: 'yourteam', displayName: 'Team Name', color: '#HEX_COLOR' },
  // ... add more teams
];
```

### Adjust Layout

The dashboard uses CSS Grid for responsive layout. Modify `src/App.css` to change the grid structure.

## Technologies Used

- React 18
- CSS3 with modern responsive design
- Open-Meteo API (weather)
- OpenStreetMap Nominatim API (location names)
- Reddit JSON API (sports feeds)
- Web Audio API (pomodoro timer alerts)

## Browser Support

Works best on modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled and location services available.

## Tips

- Set this as your browser's homepage for a perfect morning routine
- Set your "One Important Thing" each morning to stay focused
- Use the Pomodoro timer for deep work sessions
- The to-do list and daily goals automatically save to your browser
- Track your goal categories over time (work, fitness, family, other)
- All external links open in new tabs

## Security

- API keys are stored in `.env` file which is excluded from git
- Never commit the `.env` file to version control
- Use `.env.example` as a template for required environment variables

Enjoy your mornings!
