import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 4;

const Game2048 = () => {
  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState('GAME NOT OVER');

  const initializeGame = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    addNew2(newGrid);
    addNew2(newGrid);
    setGrid(newGrid);
    setGameState('GAME NOT OVER');
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const addNew2 = (grid) => {
    const emptyPositions = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 0) {
          emptyPositions.push([i, j]);
        }
      }
    }
    if (emptyPositions.length > 0) {
      const [r, c] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
      grid[r][c] = 2;
    }
  };

  const getCurrentState = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === 2048) return 'WON';
        if (grid[i][j] === 0) return 'GAME NOT OVER';
        if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return 'GAME NOT OVER';
        if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return 'GAME NOT OVER';
      }
    }
    return 'LOST';
  };

  const compress = (grid) => {
    const newGrid = grid.map(row => row.filter(cell => cell !== 0));
    newGrid.forEach(row => {
      while (row.length < GRID_SIZE) {
        row.push(0);
      }
    });
    return newGrid;
  };

  const merge = (grid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 1; j++) {
        if (grid[i][j] === grid[i][j + 1] && grid[i][j] !== 0) {
          grid[i][j] *= 2;
          grid[i][j + 1] = 0;
        }
      }
    }
    return grid;
  };

  const reverse = (grid) => grid.map(row => [...row].reverse());

  const transpose = (grid) => grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));

  const moveLeft = (grid) => {
    let newGrid = compress(grid);
    newGrid = merge(newGrid);
    newGrid = compress(newGrid);
    return newGrid;
  };

  const moveRight = (grid) => {
    let newGrid = reverse(grid);
    newGrid = moveLeft(newGrid);
    newGrid = reverse(newGrid);
    return newGrid;
  };

  const moveUp = (grid) => {
    let newGrid = transpose(grid);
    newGrid = moveLeft(newGrid);
    newGrid = transpose(newGrid);
    return newGrid;
  };

  const moveDown = (grid) => {
    let newGrid = transpose(grid);
    newGrid = moveRight(newGrid);
    newGrid = transpose(newGrid);
    return newGrid;
  };

  const move = (moveFunction) => {
    if (gameState === 'LOST' || gameState === 'WON') return;

    const newGrid = moveFunction([...grid]);
    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      addNew2(newGrid);
      setGrid(newGrid);
      const newState = getCurrentState(newGrid);
      setGameState(newState);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': move(moveUp); break;
        case 'ArrowDown': move(moveDown); break;
        case 'ArrowLeft': move(moveLeft); break;
        case 'ArrowRight': move(moveRight); break;
        default: return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameState]);

  const getCellColor = (value) => {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#cdc1b4';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#faf8ef',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>2048 Game</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        backgroundColor: '#bbada0',
        padding: '10px',
        borderRadius: '5px'
      }}>
        {grid.flat().map((cell, index) => (
          <div
            key={index}
            style={{
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              backgroundColor: getCellColor(cell),
              borderRadius: '5px',
              color: cell <= 4 ? '#776e65' : '#f9f6f2'
            }}
          >
            {cell || ''}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          {gameState === 'GAME NOT OVER' ? 'Playing...' : gameState}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        {['↑', '↓', '←', '→'].map((arrow, index) => (
          <button
            key={index}
            onClick={() => move([moveUp, moveDown, moveLeft, moveRight][index])}
            style={{
              margin: '0 0.25rem',
              padding: '0.5rem 1rem',
              fontSize: '1.25rem',
              backgroundColor: '#8f7a66',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {arrow}
          </button>
        ))}
      </div>
      {(gameState === 'LOST' || gameState === 'WON') && (
        <button
          onClick={initializeGame}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#8f7a66',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default Game2048;