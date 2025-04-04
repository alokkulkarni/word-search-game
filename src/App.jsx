import { useState, useEffect } from 'react'
import GameBoard from './components/GameBoard'
import WordList from './components/WordList'
import GameControls from './components/GameControls'
import Timer from './components/Timer'
import Modal from './components/Modal'
import './App.css'

const CATEGORIES = {
  'Food & Drinks': [
    'PIZZA', 'BURGER', 'SUSHI', 'PASTA', 'SALAD',
    'COFFEE', 'TEA', 'JUICE', 'WATER', 'MILK',
    'BREAD', 'CHEESE', 'APPLE', 'BANANA', 'GRAPE',
    'STEAK', 'CHICKEN', 'FISH', 'RICE', 'SOUP',
    'SANDWICH', 'PANCAKE', 'OMELETTE', 'SPAGHETTI', 'LASAGNA',
    'CHOCOLATE', 'CUPCAKE', 'DONUT', 'WAFFLE', 'CROISSANT'
  ],
  'Technology': [
    'LAPTOP', 'PHONE', 'TABLET', 'CAMERA', 'DRONE',
    'ROBOT', 'CHIP', 'WIFI', 'CLOUD', 'EMAIL',
    'VIRUS', 'CODE', 'APP', 'SCREEN', 'MOUSE',
    'KEYBOARD', 'PRINTER', 'SCANNER', 'ROUTER', 'SERVER',
    'MONITOR', 'SPEAKER', 'HEADPHONE', 'MICROPHONE', 'PROCESSOR',
    'MEMORY', 'STORAGE', 'NETWORK', 'BROWSER', 'DATABASE'
  ],
  'Science': [
    'ATOM', 'CELL', 'GENE', 'DNA', 'VIRUS',
    'PLANT', 'STAR', 'MOON', 'EARTH', 'SPACE',
    'LIGHT', 'SOUND', 'FORCE', 'ENERGY', 'MATTER',
    'ACID', 'BASE', 'GAS', 'LIQUID', 'SOLID',
    'GRAVITY', 'MAGNET', 'VOLTAGE', 'CURRENT', 'RESISTANCE',
    'MOLECULE', 'ELEMENT', 'COMPOUND', 'REACTION', 'EQUATION'
  ],
  'Music': [
    'PIANO', 'GUITAR', 'DRUMS', 'VIOLIN', 'FLUTE',
    'SONG', 'MELODY', 'RHYTHM', 'CHORD', 'SCALE',
    'BAND', 'CHOIR', 'ORCHESTRA', 'CONCERT', 'STAGE',
    'NOTE', 'BEAT', 'TUNE', 'LYRIC', 'HARMONY',
    'SAXOPHONE', 'TRUMPET', 'TROMBONE', 'CLARINET', 'HARP',
    'SYMPHONY', 'OPERA', 'JAZZ', 'ROCK', 'CLASSICAL'
  ]
};

const DIFFICULTY_LEVELS = {
  Easy: 10,
  Medium: 20,
  Hard: 30
};

const App = () => {
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('Food & Drinks');
  const [gridSize, setGridSize] = useState(12);
  const [words, setWords] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [grid, setGrid] = useState([]);

  const generateGrid = (size) => {
    return Array(size).fill().map(() => Array(size).fill(''));
  };

  const placeWord = (grid, word, row, col, direction) => {
    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (direction.row * i);
      const newCol = col + (direction.col * i);
      if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
        newGrid[newRow][newCol] = word[i];
      }
    }
    return newGrid;
  };

  const getRandomWords = (category, count) => {
    const categoryWords = CATEGORIES[category];
    if (!categoryWords) {
      throw new Error(`Invalid category selected`);
    }
    const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const startNewGame = () => {
    try {
      setIsLoading(true);
      setError(null);
      setFoundWords([]);
      setTimeElapsed(0);
      setIsGameActive(true);
      setShowCongrats(false);

      const wordCount = DIFFICULTY_LEVELS[difficulty];
      const selectedWords = getRandomWords(category, wordCount);
      
      if (!selectedWords || selectedWords.length === 0) {
        throw new Error('Failed to generate words for the game');
      }

      // Generate initial grid
      let newGrid = generateGrid(gridSize);
      
      // Place words in the grid
      selectedWords.forEach(word => {
        const directions = [
          { row: 1, col: 0 },   // Down
          { row: 0, col: 1 },   // Right
          { row: 1, col: 1 },   // Diagonal down-right
          { row: 1, col: -1 }   // Diagonal down-left
        ];
        
        let placed = false;
        let attempts = 0;
        const maxAttempts = 50;

        while (!placed && attempts < maxAttempts) {
          const direction = directions[Math.floor(Math.random() * directions.length)];
          const startRow = Math.floor(Math.random() * (gridSize - word.length));
          const startCol = Math.floor(Math.random() * (gridSize - word.length));
          
          if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
            newGrid = placeWord(newGrid, word, startRow, startCol, direction);
            placed = true;
          }
          attempts++;
        }
      });

      // Fill remaining cells with random letters
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (newGrid[i][j] === '') {
            newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          }
        }
      }

      setGrid(newGrid);
      setWords(selectedWords);
      setHasStarted(true);
    } catch (err) {
      console.error('Error starting new game:', err);
      setError(err.message || 'Failed to start new game');
      setHasStarted(false);
      setIsGameActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + (direction.row * i);
      const newCol = col + (direction.col * i);
      if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length) {
        return false;
      }
      const cell = grid[newRow][newCol];
      if (cell !== '' && cell !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setGridSize(newDifficulty === 'Easy' ? 12 : newDifficulty === 'Medium' ? 15 : 25);
    setHasStarted(false);
    setError(null);
  };

  const handleCategoryChange = (newCategory) => {
    if (!CATEGORIES[newCategory]) {
      setError('Invalid category selected');
      return;
    }
    setCategory(newCategory);
    setHasStarted(false);
    setError(null);
  };

  const handleWordFound = ({ word, cells }) => {
    if (!foundWords.some(fw => fw.word === word)) {
      setFoundWords(prev => [...prev, { word, cells }]);
      
      if (foundWords.length + 1 === words.length) {
        setIsGameActive(false);
        setShowCongrats(true);
      }
    }
  };

  const handlePlayAgain = () => {
    setShowCongrats(false);
    setFoundWords([]);
    setTimeElapsed(0);
    setIsGameActive(false);
    setHasStarted(false);
    setError(null);
  };

  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive]);

  return (
    <div className="app">
      <h1>Word Search Game</h1>
      <div className="game-controls-container">
        <GameControls
          onNewGame={startNewGame}
          onDifficultyChange={handleDifficultyChange}
          onCategoryChange={handleCategoryChange}
          currentDifficulty={difficulty}
          currentCategory={category}
          categories={Object.keys(CATEGORIES)}
        />
        {hasStarted && <Timer timeElapsed={timeElapsed} />}
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : hasStarted ? (
        <div className="game-container">
          <div className="game-content">
            <div className="game-sidebar">
              <WordList
                words={words}
                foundWords={foundWords}
                category={category}
              />
            </div>
            <div className="game-main">
              <GameBoard
                grid={grid}
                words={words}
                foundWords={foundWords}
                onWordFound={handleWordFound}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="start-message">
          <p>Select your difficulty and category, then click "New Game" to start!</p>
        </div>
      )}

      {showCongrats && (
        <Modal isOpen={showCongrats} onClose={handlePlayAgain}>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You found all the words in {timeElapsed} seconds!</p>
          <button className="play-again-btn" onClick={handlePlayAgain}>
            Play Again
          </button>
        </Modal>
      )}
    </div>
  );
};

export default App;

