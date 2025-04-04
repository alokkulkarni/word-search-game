import './WordList.css';

const WordList = ({ words, foundWords, category }) => {
  return (
    <div className="word-list">
      <h3>{category}</h3>
      <div className="words-container">
        {words.map((word) => {
          const isFound = foundWords.some(fw => fw.word === word);
          return (
            <div
              key={word}
              className={`word-item ${isFound ? 'found' : ''}`}
            >
              {word}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordList; 