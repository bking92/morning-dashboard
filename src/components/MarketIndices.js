import React, { useState, useEffect } from 'react';
import './MarketIndices.css';

function MarketIndices() {
  const [indices, setIndices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      // Using Yahoo Finance API via proxy
      const symbols = ['^GSPC', '^DJI', '^IXIC']; // S&P 500, Dow, Nasdaq
      const promises = symbols.map(symbol =>
        fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)
          .then(res => res.json())
      );

      const results = await Promise.all(promises);

      const marketData = results.map((data, index) => {
        const quote = data.chart.result[0];
        const meta = quote.meta;
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        const names = ['S&P 500', 'Dow', 'Nasdaq'];
        return {
          name: names[index],
          price: currentPrice,
          change: change,
          changePercent: changePercent
        };
      });

      setIndices(marketData);
      setLoading(false);
    } catch (err) {
      console.error('Market data error:', err);
      setError('Unable to fetch market data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="market-widget widget">
        <h2>Markets</h2>
        <div className="loading">Loading market data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-widget widget">
        <h2>Markets</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="market-widget widget">
      <h2>Markets</h2>
      <div className="indices-grid">
        {indices.map((index, i) => (
          <div key={i} className="index-item">
            <div className="index-name">{index.name}</div>
            <div className="index-price">{index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className={`index-change ${index.change >= 0 ? 'positive' : 'negative'}`}>
              {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketIndices;
