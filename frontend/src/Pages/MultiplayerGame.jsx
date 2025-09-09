import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../App';
import { useAuth } from '../App';
import Navbar from '../Components/Navbar';
import io from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://bingov-backend.onrender.com';

function generateEmptyMarked() {
  return Array.from({ length: 5 }, () => Array(5).fill(false));
}

// Check how many lines are completed for a board (kept for local sanity checks if needed)
const checkCompletedLines = (board, marked) => {
  let completedLines = 0;
  for (let row = 0; row < 5; row++) {
    if (marked[row].every(Boolean)) completedLines++;
  }
  for (let col = 0; col < 5; col++) {
    let all = true;
    for (let row = 0; row < 5; row++) {
      if (!marked[row][col]) { all = false; break; }
    }
    if (all) completedLines++;
  }
  let diag1 = true;
  for (let i = 0; i < 5; i++) { if (!marked[i][i]) { diag1 = false; break; } }
  if (diag1) completedLines++;
  let diag2 = true;
  for (let i = 0; i < 5; i++) { if (!marked[i][4 - i]) { diag2 = false; break; } }
  if (diag2) completedLines++;
  return completedLines;
};

const MultiplayerGame = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [step, setStep] = useState('menu'); // menu | waiting | playing | ended
  const [gameCode, setGameCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [yourBoard, setYourBoard] = useState([]);
  const [opponentBoard, setOpponentBoard] = useState([]);
  const [yourMarked, setYourMarked] = useState(generateEmptyMarked());
  const [opponentMarked, setOpponentMarked] = useState(generateEmptyMarked());
  const [turn, setTurn] = useState(0);
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [timer, setTimer] = useState(30);
  const [winnerIdx, setWinnerIdx] = useState(null); // server index (0/1), null = none/abort
  const [boardsRevealed, setBoardsRevealed] = useState(false);
  const [error, setError] = useState('');
  const [playerIdx, setPlayerIdx] = useState(null); // this client's index (0 or 1)
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [yourLines, setYourLines] = useState(0);
  const [opponentLines, setOpponentLines] = useState(0);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);
  const timerRef = useRef();

  // --- Toast timer ---
useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [showToast]);

  // --- Socket.IO setup ---
  useEffect(() => {
    const s = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { tabId: Math.random().toString(36).slice(2) }
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // show toast helper
  const showToastMessage = (msg, duration = 3000) => {
    clearTimeout(toastTimeoutRef.current);
    setToastMsg(msg);
    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, duration);
  };

  // --- Socket event handlers ---
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setError('');
    const handleDisconnect = () => setError('Disconnected from server.');

    const handleGameStart = ({ boards, turn, playerIdx: idx, calledNumbers: called = [], lines = [0,0] }) => {
      setPlayerIdx(idx);
      setYourBoard(boards[idx]);
      setOpponentBoard(boards[1 - idx]);
      setYourMarked(generateEmptyMarked());
      setOpponentMarked(generateEmptyMarked());
      setTurn(turn);
      setIsYourTurn(turn === idx);
      setStep('playing');
      setBoardsRevealed(false);
      setWinnerIdx(null);
      setTimer(30);
      setCalledNumbers(called);
      setYourLines(lines[idx] ?? 0);
      setOpponentLines(lines[1 - idx] ?? 0);
      showToastMessage('Game started — good luck!', 2000);
    };

    const handleMove = ({ number, by, turn: newTurn, marked, lines, calledNumbers: called = [], skipped }) => {
      // update called numbers from server (single source of truth)
      setCalledNumbers(called);

      // update marked boards from server-provided marked matrices (if present)
      if (Array.isArray(marked) && playerIdx !== null) {
        const myMarked = marked[playerIdx];
        const oppMarked = marked[1 - playerIdx];
        if (myMarked) setYourMarked(myMarked);
        if (oppMarked) setOpponentMarked(oppMarked);
      } else {
        // fallback: mark locally using calledNumbers if server didn't provide marked (rare)
        // (we still keep server as source of truth)
      }

      // update lines from server
      if (Array.isArray(lines) && playerIdx !== null) {
        setYourLines(lines[playerIdx] ?? 0);
        setOpponentLines(lines[1 - playerIdx] ?? 0);
      } else {
        setYourLines(checkCompletedLines(yourBoard, yourMarked));
        setOpponentLines(checkCompletedLines(opponentBoard, opponentMarked));
      }

      // show a small toast for the called number
      if (number !== null && !skipped) {
        showToastMessage(`Number called: ${number}`, 1200);
      } else if (skipped) {
        showToastMessage('Turn skipped (timeout).', 1200);
      }

      setTurn(newTurn);
      setIsYourTurn(newTurn === playerIdx);
      setTimer(30);
    };

    const handleTimer = ({ timeLeft }) => setTimer(timeLeft);

    const handleGameEnd = ({ winner, winnerByLastCall, lastCallBy, boards, marked, lines, moves, calledNumbers: called = [], reason }) => {
      // winner: 0/1 => index; null => aborted/disconnect
      setWinnerIdx(winner);
      setBoardsRevealed(true);

      if (boards && playerIdx !== null) {
        setYourBoard(boards[playerIdx]);
        setOpponentBoard(boards[1 - playerIdx]);
      }
      if (marked && playerIdx !== null) {
        setYourMarked(marked[playerIdx]);
        setOpponentMarked(marked[1 - playerIdx]);
      }
      if (Array.isArray(lines) && playerIdx !== null) {
        setYourLines(lines[playerIdx] ?? 0);
        setOpponentLines(lines[1 - playerIdx] ?? 0);
      }

      setCalledNumbers(called);
      setStep('ended');

      // build toast message
      if (winner === null) {
        const msg = reason ? `Game ended: ${reason}` : 'Game ended.';
        showToastMessage(msg, 4000);
      } else {
        // winner is 0 or 1; determine if current client won
        const won = (playerIdx !== null && winner === playerIdx);
        let msg = won ? 'You win! 🎉' : 'Opponent wins!';
        if (winnerByLastCall) {
          // show tie-break explanation
          const byYou = lastCallBy === playerIdx;
          msg += ` (decided by last call${byYou ? ' — your call' : ''})`;
        }
        showToastMessage(msg, 5000);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('gameStart', handleGameStart);
    socket.on('move', handleMove);
    socket.on('timer', handleTimer);
    socket.on('gameEnd', handleGameEnd);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('gameStart', handleGameStart);
      socket.off('move', handleMove);
      socket.off('timer', handleTimer);
      socket.off('gameEnd', handleGameEnd);
      clearTimeout(toastTimeoutRef.current);
    };
  }, [socket, playerIdx, yourBoard, yourMarked, opponentBoard, opponentMarked]);

  // --- Timer auto-decrement (client side UI only) ---
  useEffect(() => {
    if (step !== 'playing' || !isYourTurn) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step, isYourTurn]);

  // --- Create Game ---
  const handleCreateGame = () => {
    if (!socket) return;
    setError('');
    socket.emit('createGame', ({ code, board }) => {
      setGameCode(code);
      setYourBoard(board);
      setPlayerIdx(0); // creator is player 0 until joiner arrives
      setStep('waiting');
      setYourMarked(generateEmptyMarked());
      setOpponentMarked(generateEmptyMarked());
      setCalledNumbers([]);
      setYourLines(0);
      setOpponentLines(0);
      showToastMessage(`Game created: ${code}`, 2500);
    });
  };

  // --- Join Game ---
  const handleJoinGame = () => {
    if (!socket) return;
    setError('');
    socket.emit('joinGame', { code: inputCode.trim().toUpperCase() }, ({ error }) => {
      if (error) {
        setError(error);
        return;
      }
      setGameCode(inputCode.trim().toUpperCase());
      // actual boards + playerIdx will be received from 'gameStart' event
      showToastMessage(`Joining game ${inputCode.trim().toUpperCase()}...`, 2000);
    });
  };

  // --- Select Number ---
  const handleSelectNumber = (number) => {
    if (!socket) return;
    if (!isYourTurn || step !== 'playing' || winnerIdx !== null) return;
    // send pick to server; server validates and broadcasts calledNumbers
    socket.emit('selectNumber', { number });
  };

  // --- UI helpers ---
  const resultText = (() => {
    if (winnerIdx === null) return 'Game Over';
    if (playerIdx === null) return 'Game Over';
    return winnerIdx === playerIdx ? 'You Win! 🎉' : 'Opponent Wins!';
  })();

  return (
    <>
      <Navbar />
      <div className={`min-h-screen py-8 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🎯 Multiplayer Bingo
            </h1>
            <div className="mb-2">
              <span className="text-lg font-semibold text-gray-500">Invite a friend and play in real time!</span>
            </div>
          </div>

          {/* Menu */}
          {step === 'menu' && (
            <div className="flex flex-col items-center space-y-6">
              <button onClick={handleCreateGame} className="px-8 py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-105 transition-all">
                + Create Game
              </button>
              <div className="flex items-center space-x-2">
                <input type="text" value={inputCode} onChange={e => setInputCode(e.target.value)} placeholder="Enter game code" className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button onClick={handleJoinGame} className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:scale-105 transition-all">
                  Join Game
                </button>
              </div>
              {error && <div className="text-red-500 font-semibold">{error}</div>}
            </div>
          )}

          {/* Waiting */}
          {step === 'waiting' && (
            <div className="flex flex-col items-center space-y-6 mt-12">
              <div className="text-xl font-bold text-blue-600">Share this code with your friend:</div>
              <div className="text-3xl font-mono bg-green-700 rounded-lg px-8 py-4 shadow border border-blue-300 select-all">
                {gameCode}
              </div>
              <div className="text-gray-500">Waiting for opponent to join...</div>
            </div>
          )}

          {/* Timer and Lines (Called Numbers moved below boards) */}
          {step === 'playing' && (
            <div className="flex flex-col items-center mt-8">
              <div className="text-lg font-semibold mb-2">
                {isYourTurn ? <span className="text-cyan-500">Your Turn</span> : <span className="text-green-600">Opponent's Turn</span>}
              </div>
              <div className="text-2xl font-bold mb-2">⏰ {timer}s</div>
              <div className="flex justify-between w-full max-w-md mb-4">
                <div className="text-lg font-semibold text-cyan-500">
                  Your Lines: {yourLines}/5
                </div>
                <div className="text-lg font-semibold text-green-600">
                  Opponent Lines: {opponentLines}/5
                </div>
              </div>
            </div>
          )}

          {/* Playing */}
          {step === 'playing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Your Board */}
              <div className="rounded-2xl p-6 border-2 bg-white/50 border-gray-200 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-center mb-6 text-blue-600">👤 Your Board</h3>
                <div className="grid grid-cols-5 gap-2">
                  {yourBoard.map((row, rowIndex) =>
                    row.map((number, colIndex) => {
                      const isCalled = calledNumbers.includes(number);
                      return (
                        <button
                          key={`${rowIndex}-${colIndex}`}
                          onClick={() => handleSelectNumber(number)}
                          disabled={isCalled || !isYourTurn || winnerIdx !== null}
                          className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed ${
                            yourMarked[rowIndex][colIndex]
                              ? 'bg-red-500 text-white line-through'
                              : isYourTurn && winnerIdx === null
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
                      );
                    })
                  )}
                </div>
              </div>

              {/* Opponent Board */}
              <div className="rounded-2xl p-6 border-2 bg-white/50 border-gray-200 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-center mb-6 text-green-600">🧑‍🤝‍🧑 Opponent Board</h3>
                <div className="grid grid-cols-5 gap-2">
                  {opponentBoard.map((row, rowIndex) =>
                    row.map((number, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          opponentMarked[rowIndex][colIndex]
                            ? 'bg-red-500 text-white line-through'
                            : isDarkMode
                              ? 'bg-gray-700 text-gray-400'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {boardsRevealed ? number : '?'}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Called Numbers moved below the two boards */}
          {step === 'playing' && (
            <div className="flex flex-col items-center mt-8">
              <div className="mt-4 p-4 bg-white/90 rounded-lg shadow-md">
                <div className="text-lg font-semibold mb-2 text-blue-600">Called Numbers:</div>
                <div className="flex flex-wrap gap-2 max-w-md justify-center">
                  {calledNumbers.map((num, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          

          {/* Game Ended */}
          {step === 'ended' && (
            <div className="flex flex-col items-center mt-12 space-y-6">
              <div className="text-3xl font-bold">
                {resultText}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl p-6 border-2 bg-white/50 border-gray-200 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-center mb-6 text-blue-600">👤 Your Board</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {yourBoard.map((row, rowIndex) =>
                      row.map((number, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                            yourMarked[rowIndex][colIndex]
                              ? 'bg-red-500 text-white line-through'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {number}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-2xl p-6 border-2 bg-white/50 border-gray-200 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-center mb-6 text-green-600">🧑‍🤝‍🧑 Opponent Board</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {opponentBoard.map((row, rowIndex) =>
                      row.map((number, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                            opponentMarked[rowIndex][colIndex]
                              ? 'bg-red-500 text-white line-through'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {number}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="mt-8 px-8 py-4 rounded-lg font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-105 transition-all"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed top-12 right-5 z-50">
            <div className="px-4 py-3 rounded-lg shadow-lg bg-gray-800 text-gray-100">
              {toastMsg}
            </div>
          </div>
        )}
        {/* Error Banner */}
        {error && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
            <div className="px-4 py-3 rounded-lg shadow-lg bg-red-600 text-white">
              {error}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MultiplayerGame;
