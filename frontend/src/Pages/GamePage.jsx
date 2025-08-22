import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';

function createBingoBoard() {
  const numbers = [];
  while (numbers.length < 25) {
    const n = Math.floor(Math.random() * 25) + 1;
    if (!numbers.includes(n)) numbers.push(n);
  }
  return Array.from({ length: 5 }, (_, i) => numbers.slice(i * 5, i * 5 + 5));
}

function markNumber(board, number) {
  return board.map(row => row.map(cell => (cell === number ? 0 : cell)));
}

function checkBingo(board, state) {
  let newBingo = 0;
  const { Rows, Columns, frontDiagonal, backDiagonal } = state;
  // Row check
  for (let row = 0; row < 5; row++) {
    if (!Rows.has(row) && board[row].every(cell => cell === 0)) {
      Rows.add(row);
      newBingo++;
    }
  }
  // Column check
  for (let col = 0; col < 5; col++) {
    if (!Columns.has(col) && board.every(row => row[col] === 0)) {
      Columns.add(col);
      newBingo++;
    }
  }
  // Back diagonal
  if (!backDiagonal.value && [0,1,2,3,4].every(i => board[i][i] === 0)) {
    backDiagonal.value = true;
    newBingo++;
  }
  // Front diagonal
  if (!frontDiagonal.value && [0,1,2,3,4].every(i => board[i][4-i] === 0)) {
    frontDiagonal.value = true;
    newBingo++;
  }
  return newBingo;
}

function getAllUncalledNumbers(board, calledNumbers) {
  return board.flat().filter(n => n !== 0 && !calledNumbers.includes(n));
}

function GamePage() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, won, lost
  const [playerBoard, setPlayerBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [gameTimer, setGameTimer] = useState(0);
  const [playerState, setPlayerState] = useState({
    Rows: new Set(),
    Columns: new Set(),
    frontDiagonal: { value: false },
    backDiagonal: { value: false },
  });
  const [computerState, setComputerState] = useState({
    Rows: new Set(),
    Columns: new Set(),
    frontDiagonal: { value: false },
    backDiagonal: { value: false },
  });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [lastComputerNumber, setLastComputerNumber] = useState(null);
  const [playerBingo, setPlayerBingo] = useState(0);
  const [computerBingo, setComputerBingo] = useState(0);

  const generateBoard = () => createBingoBoard();

  const startGame = () => {
    setPlayerBoard(generateBoard());
    setComputerBoard(generateBoard());
    setCalledNumbers([]);
    setGameTimer(0);
    setPlayerState({
      Rows: new Set(),
      Columns: new Set(),
      frontDiagonal: { value: false },
      backDiagonal: { value: false },
    });
    setComputerState({
      Rows: new Set(),
      Columns: new Set(),
      frontDiagonal: { value: false },
      backDiagonal: { value: false },
    });
    setPlayerBingo(0);
    setComputerBingo(0);
    setGameState('playing');
    setIsPlayerTurn(true);
    setLastComputerNumber(null);
  };

  // Player selects a number by clicking
  const handlePlayerNumberClick = (number) => {
    if (!isPlayerTurn || calledNumbers.includes(number) || number === 0 || gameState !== 'playing') return;
    processTurn(number, true);
  };

  // Computer picks a number randomly from its uncalled numbers
  const computerTurn = (updatedPlayerBoard, updatedComputerBoard, updatedCalledNumbers) => {
    const availableNumbers = getAllUncalledNumbers(computerBoard, updatedCalledNumbers);
    if (availableNumbers.length === 0) return;
    const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    setTimeout(() => {
      processTurn(randomNumber, false, updatedPlayerBoard, updatedComputerBoard, updatedCalledNumbers);
      setLastComputerNumber(randomNumber);
    }, 700); // Small delay for UX
  };

  // Process a turn (player or computer)
  const processTurn = (number, isPlayer, prevPlayerBoard, prevComputerBoard, prevCalledNumbers) => {
    const pBoard = prevPlayerBoard || playerBoard;
    const cBoard = prevComputerBoard || computerBoard;
    const cNumbers = prevCalledNumbers || calledNumbers;
    const newCalledNumbers = [...cNumbers, number];
    const newPlayerBoard = markNumber(pBoard, number);
    const newComputerBoard = markNumber(cBoard, number);
    setPlayerBoard(newPlayerBoard);
    setComputerBoard(newComputerBoard);
    setCalledNumbers(newCalledNumbers);
    // Check for new bingos
    const playerNewBingo = checkBingo(newPlayerBoard, playerState);
    const computerNewBingo = checkBingo(newComputerBoard, computerState);
    const updatedPlayerBingo = playerBingo + playerNewBingo;
    const updatedComputerBingo = computerBingo + computerNewBingo;
    setPlayerBingo(updatedPlayerBingo);
    setComputerBingo(updatedComputerBingo);
    if (updatedPlayerBingo >= 5 && updatedComputerBingo >= 5) {
      setGameState('draw');
    } else if (updatedPlayerBingo >= 5) {
      setGameState('won');
    } else if (updatedComputerBingo >= 5) {
      setGameState('lost');
    } else if (newCalledNumbers.length === 25) {
      setGameState('draw');
    } else {
      setIsPlayerTurn(!isPlayer);
      if (isPlayer) {
        // Computer's turn next
        computerTurn(newPlayerBoard, newComputerBoard, newCalledNumbers);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Render a Bingo board
  const renderBoard = (board, isPlayer = true, onClickNumber) => {
    return (
      <div className="grid grid-cols-5 gap-1">
        {board.map((row, rowIndex) => (
          row.map((number, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer ${
                number === 0
                  ? (isDarkMode 
                      ? 'bg-green-500 text-white' 
                      : 'bg-green-500 text-white')
                  : (isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300')
              } ${isPlayer && gameState === 'playing' && !calledNumbers.includes(number) && number !== 0 ? 'hover:ring-2 hover:ring-blue-400' : ''}`}
              onClick={isPlayer && gameState === 'playing' && !calledNumbers.includes(number) && number !== 0 ? () => onClickNumber(number) : undefined}
            >
              {number === 0 ? '' : number}
            </div>
          ))
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Game Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🎯 Bingo Game
            </h1>
            <div className="flex items-center justify-between">
              <div className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Player: <span className={`font-semibold ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>{user?.username || 'Player'}</span>
              </div>
              <div className={`text-lg ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Time: <span className={`font-semibold ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>{Math.floor(gameTimer / 60)}:{(gameTimer % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Game Controls */}
          {gameState === 'waiting' && (
            <div className={`rounded-xl p-6 border-2 mb-8 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-center">
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Ready to Play?
                </h2>
                <p className={`mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  You'll be playing against the computer. Get 5 lines (rows, columns, or diagonals) to win!
                </p>
                <button
                  onClick={startGame}
                  className={`px-8 py-4 rounded-lg text-lg font-bold transform hover:scale-105 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                  }`}
                >
                  🚀 Start Game
                </button>
              </div>
            </div>
          )}

          {/* Game Interface */}
          {gameState === 'playing' && (
            <div className="space-y-8 flex flex-col items-center">
              {/* Player Board */}
              <div className={`rounded-xl p-6 border-2 mx-auto ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border-gray-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Board
                </h3>
                {playerBoard.length > 0 && renderBoard(playerBoard, true, handlePlayerNumberClick)}
                {lastComputerNumber && (
                  <div className="mt-4 text-center">
                    <span className={`text-base font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>Computer called: {lastComputerNumber}</span>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <span className={`text-base font-semibold ${isPlayerTurn ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600') : (isDarkMode ? 'text-pink-400' : 'text-pink-600')}`}>{isPlayerTurn ? "Your turn!" : "Computer's turn..."}</span>
                </div>
              </div>
              {/* Called Numbers */}
              <div className={`rounded-xl p-6 border-2 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border-gray-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                  Called Numbers ({calledNumbers.length}/25)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {calledNumbers.map((number, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDarkMode 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {number}
                  </div>
                  ))}
                </div>
                    </div>
                  </div>
                )}

          {/* Game Result */}
          {(gameState === 'won' || gameState === 'lost' || gameState === 'draw') && (
            <div className="space-y-8 flex flex-col items-center">
                {/* Player Board */}
              <div className={`rounded-xl p-6 border-2 mx-auto ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                    : 'bg-white/50 border-gray-200 backdrop-blur-sm'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 text-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Board
                  </h3>
                  {playerBoard.length > 0 && renderBoard(playerBoard, true)}
                </div>
              {/* Computer Board - now visible */}
              <div className={`rounded-xl p-6 border-2 mx-auto ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                    : 'bg-white/50 border-gray-200 backdrop-blur-sm'
                }`}>
                  <h3 className={`text-xl font-bold mb-4 text-center ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Computer's Board
                  </h3>
                  {computerBoard.length > 0 && renderBoard(computerBoard, false)}
                </div>
              {/* Called Numbers */}
              <div className={`rounded-xl p-6 border-2 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border-gray-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-lg font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Called Numbers ({calledNumbers.length}/25)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {calledNumbers.map((number, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isDarkMode 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
              {/* Game Result Message */}
            <div className={`rounded-xl p-8 border-2 text-center ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <div className="text-6xl mb-4">
                {gameState === 'won' ? '🎉' : gameState === 'lost' ? '😔' : '🤝'}
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {gameState === 'won' ? 'Congratulations! You Won!' : 
                 gameState === 'lost' ? 'Computer Wins!' : 'It\'s a Draw!'}
              </h2>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                  }`}
                >
                  🎮 Play Again
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🏠 Back to Dashboard
                </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GamePage; 