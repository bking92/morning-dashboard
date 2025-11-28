import React, { useState, useEffect } from 'react';
import './Weather.css';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWeather();
  }, []);

  const getWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Note: Open-Meteo doesn't require an API key, but we keep the env var for potential future use
            // Fetch weather data from Open-Meteo (no API key required)
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`
            );

            if (!weatherResponse.ok) {
              throw new Error('Weather data not available');
            }

            const weatherData = await weatherResponse.json();

            // Fetch location name using reverse geocoding
            const geoResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );

            let locationName = 'Your Location';
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              locationName = geoData.address.city || geoData.address.town || geoData.address.county || 'Your Location';
            }

            // Transform data to match our component structure
            const transformedData = {
              name: locationName,
              main: {
                temp: weatherData.current.temperature_2m,
                feels_like: weatherData.current.temperature_2m, // Open-Meteo doesn't provide feels_like
                temp_max: weatherData.daily.temperature_2m_max[0],
                temp_min: weatherData.daily.temperature_2m_min[0]
              },
              wind: {
                speed: weatherData.current.wind_speed_10m
              },
              uv: {
                index: weatherData.daily.uv_index_max[0]
              },
              weather: [{
                description: getWeatherDescription(weatherData.current.weather_code),
                icon: getWeatherIcon(weatherData.current.weather_code)
              }]
            };

            setWeather(transformedData);
            setLoading(false);
          } catch (err) {
            console.error('Weather API Error:', err);
            setError(`Unable to fetch weather data: ${err.message}`);
            setLoading(false);
          }
        },
        (err) => {
          setError('Location access denied. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  // Helper function to convert WMO weather codes to descriptions
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'foggy',
      48: 'foggy',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      71: 'slight snow',
      73: 'moderate snow',
      75: 'heavy snow',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with hail',
      99: 'thunderstorm with hail'
    };
    return weatherCodes[code] || 'unknown';
  };

  // Helper function to convert WMO weather codes to icon codes
  const getWeatherIcon = (code) => {
    const iconMap = {
      0: '01d',
      1: '02d',
      2: '03d',
      3: '04d',
      45: '50d',
      48: '50d',
      51: '09d',
      53: '09d',
      55: '09d',
      61: '10d',
      63: '10d',
      65: '10d',
      71: '13d',
      73: '13d',
      75: '13d',
      77: '13d',
      80: '09d',
      81: '09d',
      82: '09d',
      85: '13d',
      86: '13d',
      95: '11d',
      96: '11d',
      99: '11d'
    };
    return iconMap[code] || '01d';
  };

  if (loading) return <div className="weather-widget widget"><div className="loading">Loading weather...</div></div>;
  if (error) return <div className="weather-widget widget"><div className="error">{error}</div></div>;

  return (
    <div className="weather-widget widget">
      <div className="weather-main">
        <div className="weather-temp">
          <span className="temp-value">{Math.round(weather.main.temp)}°F</span>
          <div className="weather-icon">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </div>
        </div>
        <div className="weather-details">
          <h3>{weather.name}</h3>
          <p className="weather-description">{weather.weather[0].description}</p>
          <p className="temp-range">H: {Math.round(weather.main.temp_max)}° • L: {Math.round(weather.main.temp_min)}°</p>
          <div className="weather-stats">
            <div className="stat">
              <span className="stat-label">Feels like</span>
              <span className="stat-value">{Math.round(weather.main.feels_like)}°F</span>
            </div>
            <div className="stat">
              <span className="stat-label">UV Index</span>
              <span className="stat-value">{Math.round(weather.uv.index)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Wind</span>
              <span className="stat-value">{Math.round(weather.wind.speed)} mph</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
