import React, { useState } from 'react';
import './GameBoard.css';

const GameBoard = ({ grid, words, foundWords, onWordFound }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [tempSelectedCells, setTempSelectedCells] = useState([]);
  const [selectionDirection, setSelectionDirection] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const isAdjacent = (cell1, cell2) => {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
  };

  const handleMouseDown = (row, col) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
    setTempSelectedCells([{ row, col }]);
    setSelectionDirection(null);
  };

  const handleMouseEnter = (row, col) => {
    if (!isSelecting) return;

    const cell = { row, col };
    const lastCell = selectedCells[selectedCells.length - 1];

    if (!isAdjacent(cell, lastCell)) return;

    if (selectedCells.length === 1) {
      const newDirection = {
        row: cell.row - lastCell.row,
        col: cell.col - lastCell.col
      };
      setSelectionDirection(newDirection);
      setSelectedCells([lastCell, cell]);
      setTempSelectedCells([lastCell, cell]);
    } else {
      const nextCell = {
        row: lastCell.row + selectionDirection.row,
        col: lastCell.col + selectionDirection.col
      };

      if (cell.row === nextCell.row && cell.col === nextCell.col) {
        const newSelectedCells = [...selectedCells, cell];
        setSelectedCells(newSelectedCells);
        setTempSelectedCells(newSelectedCells);
      }
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedCells.length > 1) {
      const selectedWord = selectedCells.map(c => grid[c.row][c.col]).join('');
      const isWordFound = words.some(word => word === selectedWord);
      
      if (isWordFound) {
        onWordFound({ word: selectedWord, cells: selectedCells });
      }
    }
    
    setIsSelecting(false);
    setSelectedCells([]);
    setTempSelectedCells([]);
    setSelectionDirection(null);
  };

  return (
    <div className="game-board">
      <div className={`grid grid-${grid.length}`}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => {
              const isSelected = selectedCells.some(c => c.row === rowIndex && c.col === colIndex);
              const isTempSelected = tempSelectedCells.some(c => c.row === rowIndex && c.col === colIndex);
              const isFound = foundWords.some(fw => 
                fw.cells.some(c => c.row === rowIndex && c.col === colIndex)
              );

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${isSelected ? 'selected' : ''} ${isTempSelected ? 'temp-selected' : ''} ${isFound ? 'correct' : ''}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard; 