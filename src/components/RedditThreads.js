import React, { useState, useEffect } from 'react';
import './RedditThreads.css';

function RedditThreads() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subreddits = [
    { name: '49ers', displayName: 'SF 49ers', color: '#AA0000' },
    { name: 'SFGiants', displayName: 'SF Giants', color: '#FD5A1E' },
    { name: 'warriors', displayName: 'GS Warriors', color: '#1D428A' }
  ];

  useEffect(() => {
    fetchRedditThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRedditThreads = async () => {
    try {
      const allThreads = [];

      for (const sub of subreddits) {
        // Fetch more posts initially so we can filter and still get 3
        const response = await fetch(
          `https://www.reddit.com/r/${sub.name}/hot.json?limit=20`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          console.error(`Reddit API error for r/${sub.name}:`, response.status, response.statusText);
          throw new Error(`Reddit data not available (${response.status})`);
        }

        const data = await response.json();

        // Filter out posts with "thread" in the title and take only 3
        const filteredPosts = data.data.children
          .filter(child => !child.data.title.toLowerCase().includes('thread'))
          .slice(0, 3)
          .map(child => ({
            ...child.data,
            subreddit: sub.displayName,
            color: sub.color
          }));

        allThreads.push(...filteredPosts);
      }

      setThreads(allThreads);
      setLoading(false);
    } catch (err) {
      console.error('Reddit fetch error:', err);
      setError(`Unable to fetch Reddit threads: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reddit-widget widget">
        <h2>Bay Area Sports</h2>
        <div className="loading">Loading Reddit threads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reddit-widget widget">
        <h2>Bay Area Sports</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="reddit-widget widget">
      <h2>Bay Area Sports</h2>
      <div className="reddit-list">
        {threads.map((thread, index) => (
          <a
            key={index}
            href={`https://reddit.com${thread.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="reddit-item"
          >
            <div
              className="reddit-badge"
              style={{ backgroundColor: thread.color }}
            >
              {thread.subreddit}
            </div>
            <div className="reddit-content">
              <h3 className="reddit-title">{thread.title}</h3>
              <div className="reddit-stats">
                <span className="reddit-stat">↑ {thread.ups}</span>
                <span className="reddit-stat">💬 {thread.num_comments}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default RedditThreads;
