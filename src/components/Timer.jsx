import './Timer.css';

const Timer = ({ timeElapsed }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <span className="timer-icon">⏱️</span>
      <span className="timer-value">{formatTime(timeElapsed)}</span>
    </div>
  );
};

export default Timer; 