import './GameControls.css';

const GameControls = ({
  onNewGame,
  onDifficultyChange,
  onCategoryChange,
  currentDifficulty,
  currentCategory,
  categories
}) => {
  const handleCategoryChange = (e) => {
    onCategoryChange(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    onDifficultyChange(e.target.value);
  };

  return (
    <div className="game-controls">
      <div className="control-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={currentCategory}
          onChange={handleCategoryChange}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={currentDifficulty}
          onChange={handleDifficultyChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
};

export default GameControls; 