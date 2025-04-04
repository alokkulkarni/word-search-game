import React from 'react';
import './GameStatus.css';

const GameStatus = ({ foundWords, totalWords, timeElapsed }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-status">
      <div className="status-item">
        <span className="status-label">Progress:</span>
        <span className="status-value">
          {foundWords.length}/{totalWords} words
        </span>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(foundWords.length / totalWords) * 100}%` }}
          />
        </div>
      </div>
      <div className="status-item">
        <span className="status-label">Time:</span>
        <span className="status-value">{formatTime(timeElapsed)}</span>
      </div>
    </div>
  );
};

export default GameStatus; 