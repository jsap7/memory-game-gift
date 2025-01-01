'use client';

import React, { useState, useEffect } from 'react';
import styles from './SlidingGame.module.css';

const IMAGE_PATH = '/games/sliding/images/puzzle.jpg';

const SlidingGame = () => {
  const [gridSize, setGridSize] = useState(3);
  const [tiles, setTiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize puzzle
  useEffect(() => {
    initializePuzzle();
  }, [gridSize]); // Reinitialize when grid size changes

  const initializePuzzle = () => {
    const tileCount = gridSize * gridSize;
    // Create array of tiles (0 represents empty space)
    const initialTiles = Array.from({ length: tileCount - 1 }, (_, i) => i + 1);
    initialTiles.push(0); // Add empty tile
    
    // Shuffle tiles (ensuring puzzle is solvable)
    const shuffledTiles = shuffleTiles(initialTiles);
    setTiles(shuffledTiles);
    setMoves(0);
    setIsComplete(false);
  };

  // Fisher-Yates shuffle with solvability check
  const shuffleTiles = (tilesArray) => {
    const shuffled = [...tilesArray];
    let currentIndex = gridSize * gridSize;

    while (currentIndex > 1) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = 
      [shuffled[randomIndex], shuffled[currentIndex]];
    }

    // Check if puzzle is solvable
    if (!isSolvable(shuffled)) {
      // Swap last two tiles to make it solvable
      const lastIndex = shuffled.length - 1;
      [shuffled[lastIndex - 1], shuffled[lastIndex - 2]] = 
      [shuffled[lastIndex - 2], shuffled[lastIndex - 1]];
    }

    return shuffled;
  };

  // Check if puzzle is solvable
  const isSolvable = (puzzle) => {
    let inversions = 0;
    const puzzleWithoutEmpty = puzzle.filter(tile => tile !== 0);

    for (let i = 0; i < puzzleWithoutEmpty.length - 1; i++) {
      for (let j = i + 1; j < puzzleWithoutEmpty.length; j++) {
        if (puzzleWithoutEmpty[i] > puzzleWithoutEmpty[j]) {
          inversions++;
        }
      }
    }

    // For odd-sized grids, puzzle is solvable if inversions is even
    // For even-sized grids, puzzle is solvable if:
    // - the blank is on an even row from bottom and inversions is odd
    // - the blank is on an odd row from bottom and inversions is even
    const emptyIndex = puzzle.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const rowFromBottom = gridSize - emptyRow;

    if (gridSize % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      if (rowFromBottom % 2 === 0) {
        return inversions % 2 === 1;
      } else {
        return inversions % 2 === 0;
      }
    }
  };

  // Check if puzzle is complete
  const checkCompletion = (currentTiles) => {
    for (let i = 0; i < currentTiles.length - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[currentTiles.length - 1] === 0;
  };

  // Handle tile click
  const handleTileClick = (index) => {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(0);
    if (!isAdjacent(index, emptyIndex)) return;

    const newTiles = [...tiles];
    [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
    
    setTiles(newTiles);
    setMoves(moves + 1);

    if (checkCompletion(newTiles)) {
      setIsComplete(true);
    }
  };

  // Check if two tiles are adjacent
  const isAdjacent = (index1, index2) => {
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
  };

  // Calculate tile position for transform
  const getTilePosition = (index) => {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    return {
      x: col * (100 / gridSize) * gridSize,
      y: row * (100 / gridSize) * gridSize
    };
  };

  // Calculate background position for the original image piece
  const getBackgroundPosition = (number) => {
    const row = Math.floor((number - 1) / gridSize);
    const col = (number - 1) % gridSize;
    const percentage = 100 / (gridSize - 1);
    return {
      x: col * percentage,
      y: row * percentage
    };
  };

  const handleGridSizeChange = (size) => {
    setGridSize(size);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.stats}>
          Moves: {moves}
        </div>
        <div className={styles.modeButtons}>
          <button 
            onClick={() => handleGridSizeChange(3)} 
            className={`${styles.modeButton} ${gridSize === 3 ? styles.active : ''}`}
          >
            3×3
          </button>
          <button 
            onClick={() => handleGridSizeChange(4)} 
            className={`${styles.modeButton} ${gridSize === 4 ? styles.active : ''}`}
          >
            4×4
          </button>
          <button 
            onClick={() => handleGridSizeChange(5)} 
            className={`${styles.modeButton} ${gridSize === 5 ? styles.active : ''}`}
          >
            5×5
          </button>
        </div>
        <div className={styles.controls}>
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className={styles.previewButton}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button 
            onClick={initializePuzzle} 
            className={styles.button}
          >
            New Game
          </button>
        </div>
      </div>

      <div className={styles.puzzleContainer}>
        <div className={styles.puzzle}>
          {tiles.map((tile, index) => {
            if (tile === 0) return null;
            
            const pos = getTilePosition(index);
            const bgPos = getBackgroundPosition(tile);
            
            return (
              <button
                key={tile}
                onClick={() => handleTileClick(index)}
                className={styles.tile}
                style={{
                  transform: `translate(${pos.x}%, ${pos.y}%)`,
                  width: `${100/gridSize}%`,
                  height: `${100/gridSize}%`,
                  backgroundImage: `url(${IMAGE_PATH})`,
                  backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                  backgroundPosition: `${bgPos.x}% ${bgPos.y}%`
                }}
              >
                <span className={styles.tileNumber}>{tile}</span>
              </button>
            );
          })}
        </div>
      </div>

      {showPreview && (
        <>
          <div 
            className={styles.previewBackdrop}
            onClick={() => setShowPreview(false)}
          />
          <div className={styles.preview}>
            <img 
              src={IMAGE_PATH}
              alt="Complete Puzzle"
              className={styles.previewImage}
            />
          </div>
        </>
      )}

      {isComplete && (
        <div className={styles.victory}>
          <h2>Puzzle Complete!</h2>
          <p>You solved the {gridSize}×{gridSize} puzzle in {moves} moves</p>
          <button onClick={initializePuzzle} className={styles.button}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SlidingGame; 