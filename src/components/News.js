import React from 'react';
import './News.css';

function News() {
  // Note: API key stored in .env file (not used since we're showing links instead of fetching news)
  // const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

  const newsSites = [
    {
      name: 'Wall Street Journal',
      url: 'https://www.wsj.com',
      description: 'Business & Financial News',
      icon: '📰'
    },
    {
      name: 'Financial Times',
      url: 'https://www.ft.com',
      description: 'Global Business News',
      icon: '📊'
    },
    {
      name: 'RealClear Markets',
      url: 'https://www.realclearmarkets.com/',
      description: 'Market News & Analysis',
      icon: '📋'
    }
  ];

  return (
    <div className="news-widget widget">
      <h2>News Links</h2>
      <div className="news-links-list">
        {newsSites.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="news-link-item"
          >
            <div className="news-link-icon">{site.icon}</div>
            <div className="news-link-content">
              <h3 className="news-link-title">{site.name}</h3>
            </div>
            <div className="news-link-arrow">→</div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default News;
