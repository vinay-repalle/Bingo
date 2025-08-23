import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';
import apiService from '../services/api';

function GamePage() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [currentTurn, setCurrentTurn] = useState('user'); // 'user' or 'computer'
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [userBoard, setUserBoard] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [userLines, setUserLines] = useState(0); // Track user's completed lines
  const [computerLines, setComputerLines] = useState(0); // Track computer's completed lines
  const [showComputerBoard, setShowComputerBoard] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // --- Helpers to generate different boards ---
  const generateBoard = () => { // helper to create a random 5x5 board
    const nums = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    const board = [];
    for (let r = 0; r < 5; r++) board.push(nums.slice(r * 5, (r + 1) * 5));
    return board;
  };

  // Initialize game boards
  const initializeGame = useCallback(() => {
    // build two distinct boards
    const userBoardData = generateBoard();
    let computerBoardData = generateBoard();
    while (JSON.stringify(computerBoardData) === JSON.stringify(userBoardData)) {
      computerBoardData = generateBoard();
    }

    setUserBoard(userBoardData);
    setComputerBoard(computerBoardData);
    setCalledNumbers([]);
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
    setCurrentTurn('user');
    setUserLines(0);
    setComputerLines(0);
    setShowComputerBoard(false);
    setShowCelebration(false);
    setGameStartTime(Date.now());
  }, []);

  // Save game result to backend
  const saveGameResult = async (result, finalUserLines, finalComputerLines) => {
    try {
      if (!user) return; // Don't save if no user logged in
      
      const gameDuration = Math.floor((Date.now() - gameStartTime) / 1000); // in seconds
      
      const gameData = {
        result,
        opponent: 'computer',
        score: {
          userLines: finalUserLines,
          opponentLines: finalComputerLines,
          totalMoves: calledNumbers.length
        },
        duration: gameDuration
      };

      await apiService.saveGameResult(gameData);
      console.log('Game result saved successfully');
      setShowSaveSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  // Check how many lines are completed for a board
  // accepts an explicit called set to avoid stale state issues
  const checkCompletedLines = useCallback((board, calledSet) => {
    let completedLines = 0;
    
    // rows
    for (let row = 0; row < 5; row++) {
      let all = true;
      for (let col = 0; col < 5; col++) {
        if (!calledSet.has(board[row][col])) { all = false; break; }
      }
      if (all) completedLines++;
    }
    
    // cols
    for (let col = 0; col < 5; col++) {
      let all = true;
      for (let row = 0; row < 5; row++) {
        if (!calledSet.has(board[row][col])) { all = false; break; }
      }
      if (all) completedLines++;
    }
    
    // main diag
    let diag1 = true;
    for (let i = 0; i < 5; i++) { if (!calledSet.has(board[i][i])) { diag1 = false; break; } }
    if (diag1) completedLines++;
    
    // anti diag
    let diag2 = true;
    for (let i = 0; i < 5; i++) { if (!calledSet.has(board[i][4 - i])) { diag2 = false; break; } }
    if (diag2) completedLines++;
    
    return completedLines;
  }, []);

  // Handle user clicking on their board
  const handleUserBoardClick = (number) => {
    if (currentTurn !== 'user' || gameOver || calledNumbers.includes(number)) {
      return;
    }
    
    // Add number to called numbers
    const newCalledNumbers = [...calledNumbers, number];
    setCalledNumbers(newCalledNumbers);

    // use the *new* called numbers when checking lines
    const calledSet = new Set(newCalledNumbers);

    // update user lines
    const newUserLines = checkCompletedLines(userBoard, calledSet);
    setUserLines(newUserLines);

    // also update computer lines after this call (both boards hear the same call)
    const maybeComputerLines = checkCompletedLines(computerBoard, calledSet);
    setComputerLines(maybeComputerLines);
    
    // stop immediately when anyone completes 5 lines
    if (newUserLines >= 5) {
      setWinner('user');
      setGameOver(true);
      setShowCelebration(true);
      setShowComputerBoard(true);
      // Save game result
      saveGameResult('win', newUserLines, maybeComputerLines);
      return;
    }
    if (maybeComputerLines >= 5) {
      setWinner('computer');
      setGameOver(true);
      setShowComputerBoard(true);
      // Save game result
      saveGameResult('loss', newUserLines, maybeComputerLines);
      return;
    }
    
    // Switch to computer turn
    setCurrentTurn('computer');
    
    // Computer turn after 0.8 seconds
    setTimeout(() => {
      if (!gameOver) {
        computerTurn(newCalledNumbers);
      }
    }, 800);
  };

  // Computer turn
  const computerTurn = useCallback((latestCalled = calledNumbers) => {
    if (gameOver) return;
    
    // pick a number not yet called
    const availableForComputer = Array.from({ length: 25 }, (_, i) => i + 1)
      .filter(n => !latestCalled.includes(n));
    
    if (availableForComputer.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableForComputer.length);
    const selectedNumber = availableForComputer[randomIndex];
    
    // Add number to called numbers
    const newCalledNumbers = [...latestCalled, selectedNumber];
    setCalledNumbers(newCalledNumbers);
    
    // compute lines using the *new* called numbers
    const calledSet = new Set(newCalledNumbers);

    // update both players' lines since the call is global
    const newComputerLines = checkCompletedLines(computerBoard, calledSet);
    setComputerLines(newComputerLines);
    const newUserLines = checkCompletedLines(userBoard, calledSet);
    setUserLines(newUserLines);
    
    // stop immediately when anyone completes 5 lines
    if (newComputerLines >= 5) {
      setWinner('computer');
      setGameOver(true);
      setShowComputerBoard(true);
      // Save game result
      saveGameResult('loss', newUserLines, newComputerLines);
      return;
    }
    if (newUserLines >= 5) {
      setWinner('user');
      setGameOver(true);
      setShowCelebration(true);
      setShowComputerBoard(true);
      // Save game result
      saveGameResult('win', newUserLines, newComputerLines);
      return;
    }
    
    // Switch back to user turn
    setCurrentTurn('user');
  }, [calledNumbers, gameOver, userBoard, computerBoard, checkCompletedLines]);

  // Handle game over
  const handleGameOver = () => {
    setShowComputerBoard(true);
    setShowCelebration(false);
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  // Initialize game on component mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    initializeGame();
  }, [initializeGame, user, navigate]);

  // Auto-computer turn if it's computer's turn and game is active
  useEffect(() => {
    if (currentTurn === 'computer' && gameStarted && !gameOver) {
      const timer = setTimeout(() => {
        computerTurn();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameStarted, gameOver, computerTurn]);

  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-8 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              🎯 BingoV
            </h1>
            <div className="flex items-center justify-between max-w-md mx-auto mb-4">
              <div className={`text-lg font-semibold ${
                currentTurn === 'user' 
                  ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                👤 Your Turn
              </div>
              <div className={`text-lg font-semibold ${
                currentTurn === 'computer' 
                  ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                  : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                🤖 Computer Turn
              </div>
            </div>
            {/* Progress Display */}
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-cyan-400' : 'text-blue-600'
              }`}>
                👤 Your Lines: {userLines}/5
              </div>
              <div className={`text-sm font-semibold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                🤖 Computer Lines: {computerLines}/5
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="flex justify-center mb-8 space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg'
              }`}
            >
              ← Dashboard
            </button>
            <button
              onClick={resetGame}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
              }`}
            >
              🔄 New Game
            </button>
            {gameOver && (
              <button
                onClick={handleGameOver}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                }`}
              >
                 Show Computer Board
              </button>
            )}
          </div>

          {/* User Board Only - Computer board hidden during gameplay */}
          <div className="flex justify-center mb-8">
            <div className={`rounded-2xl p-6 border-2 max-w-md ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                : 'bg-white/50 border-gray-200 backdrop-blur-sm'
            }`}>
              <h3 className={`text-2xl font-bold text-center mb-6 ${
                isDarkMode ? 'text-cyan-400' : 'text-blue-600'
              }`}>
                👤 Your Board
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {userBoard.map((row, rowIndex) => 
                  row.map((number, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleUserBoardClick(number)}
                      disabled={calledNumbers.includes(number) || currentTurn !== 'user' || gameOver}
                      className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${
                        calledNumbers.includes(number)
                          ? 'bg-red-500 text-white line-through'
                          : currentTurn === 'user' && !gameOver
                            ? isDarkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600 hover:ring-2 hover:ring-cyan-400'
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:ring-2 hover:ring-blue-400'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {number}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Save Success Message */}
          {showSaveSuccess && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              isDarkMode 
                ? 'bg-green-600/20 border border-green-500 text-green-400' 
                : 'bg-green-100 border border-green-500 text-green-700'
            }`}>
              ✅ Game result saved successfully! Check your statistics in the dashboard.
            </div>
          )}

          {/* Called Numbers */}
          <div className={`rounded-2xl p-6 border-2 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
              : 'bg-white/50 border-gray-200 backdrop-blur-sm'
          }`}>
            <h3 className={`text-2xl font-bold text-center mb-6 ${
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              📢 Called Numbers ({calledNumbers.length})
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {calledNumbers.map((number, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 rounded-lg font-bold text-lg ${
                    isDarkMode 
                      ? 'bg-red-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {number}
                </div>
              ))}
            </div>
          </div>

          {/* Computer Board - Only shown after game over */}
          {showComputerBoard && (
            <div className="mt-8 flex justify-center">
              <div className={`rounded-2xl p-6 border-2 max-w-md ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm' 
                  : 'bg-white/50 border-gray-200 backdrop-blur-sm'
              }`}>
                <h3 className={`text-2xl font-bold text-center mb-6 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  🤖 Computer Board
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {computerBoard.map((row, rowIndex) => 
                    row.map((number, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          calledNumbers.includes(number)
                            ? 'bg-red-500 text-white line-through'
                            : isDarkMode
                              ? 'bg-gray-700 text-white'
                              : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {number}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className={`relative max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-600' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  BINGO! 🎯
                </h3>
                <p className={`text-xl mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Congratulations! You completed {userLines} lines! 🏆
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleGameOver}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25'
                    }`}
                  >
                    Show Computer Board
                  </button>
                  <button
                    onClick={resetGame}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                    }`}
                  >
                    🔄 New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Computer Win Modal */}
        {gameOver && winner === 'computer' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className={`relative max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border border-gray-600' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  Computer Won! 💻
                </h3>
              <p className={`text-xl mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Computer completed {computerLines} lines first! Better luck next time.
                </p>
                <div className="flex space-x-3">
                  <button
                      onClick={handleGameOver}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25'
                      }`}
                    >
                      Show Computer Board
                    </button>
                  <button
                    onClick={resetGame}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                    }`}
                  >
                    🔄 New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GamePage;
