import React, { useState, useEffect } from 'react';
import './DailyQuote.css';

function DailyQuote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random?tags=inspirational|motivational|success|wisdom');
      const data = await response.json();
      setQuote(data);
      setLoading(false);
    } catch (err) {
      console.error('Quote fetch error:', err);
      // Fallback quote if API fails
      setQuote({
        content: 'The best time to plant a tree was 20 years ago. The second best time is now.',
        author: 'Chinese Proverb'
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="daily-quote-widget widget">
        <div className="loading">Loading quote...</div>
      </div>
    );
  }

  return (
    <div className="daily-quote-widget widget">
      <div className="quote-icon">"</div>
      <p className="quote-text">{quote.content}</p>
      <p className="quote-author">— {quote.author}</p>
    </div>
  );
}

export default DailyQuote;
