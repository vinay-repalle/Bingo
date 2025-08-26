import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

// In-memory store for active games
const games = {};

/**
 * Generate a 5x5 Bingo board with numbers 1-25 shuffled
 * Returns: number[5][5]
 */
function generateBoard() {
  const nums = Array.from({ length: 25 }, (_, i) => i + 1);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return Array.from({ length: 5 }, (_, i) => nums.slice(i * 5, i * 5 + 5));
}

/**
 * Count how many completed lines exist in a 5x5 marked matrix
 * marked: boolean[5][5]
 * Returns: number of completed lines
 */
function countCompletedLines(marked) {
  let lines = 0;

  // rows
  for (let r = 0; r < 5; r++) {
    if (marked[r].every(Boolean)) lines++;
  }

  // columns
  for (let c = 0; c < 5; c++) {
    let all = true;
    for (let r = 0; r < 5; r++) {
      if (!marked[r][c]) {
        all = false;
        break;
      }
    }
    if (all) lines++;
  }

  // main diagonal
  let diag1 = true;
  for (let i = 0; i < 5; i++) {
    if (!marked[i][i]) {
      diag1 = false;
      break;
    }
  }
  if (diag1) lines++;

  // anti-diagonal
  let diag2 = true;
  for (let i = 0; i < 5; i++) {
    if (!marked[i][4 - i]) {
      diag2 = false;
      break;
    }
  }
  if (diag2) lines++;

  return lines;
}

export function initGameServer(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    // --- Create Game ---
    socket.on('createGame', (cb) => {
      let code;
      do {
        code = nanoid(6).toUpperCase();
      } while (games[code]);

      const board = generateBoard();
      const marked = Array.from({ length: 5 }, () => Array(5).fill(false));

      games[code] = {
        code,
        players: [
          { id: socket.id, board, marked, ready: true, lines: 0 },
        ],
        sockets: [socket],
        turn: 0,
        timer: null,
        started: false,
        moves: [], // array of { number, by }
        calledNumbers: [], // ordered called numbers visible to both players
        winner: null,
      };

      socket.join(code);
      socket.data.gameCode = code;
      socket.data.playerIdx = 0;

      // callback to creator with code + their board
      cb({ code, board });
    });

    // --- Join Game ---
    socket.on('joinGame', ({ code }, cb) => {
      const game = games[code];
      if (!game || game.players.length >= 2) {
        return cb({ error: 'Invalid or full game code.' });
      }

      const board = generateBoard();
      const marked = Array.from({ length: 5 }, () => Array(5).fill(false));
      game.players.push({ id: socket.id, board, marked, ready: true, lines: 0 });
      game.sockets.push(socket);

      socket.join(code);
      socket.data.gameCode = code;
      socket.data.playerIdx = 1;
      game.started = true;

      // Notify both players that game started and provide initial state
      game.players.forEach((player, idx) => {
        game.sockets[idx].emit('gameStart', {
          boards: game.players.map(p => p.board),
          turn: game.turn,
          playerIdx: idx,
          calledNumbers: game.calledNumbers,
          lines: game.players.map(p => p.lines),
        });
      });

      // start timer loop
      startTurnTimer(io, code);
      cb({ board });
    });

    // --- Player Move ---
    socket.on('selectNumber', ({ number }) => {
      const code = socket.data.gameCode;
      const idx = socket.data.playerIdx;
      const game = games[code];

      console.log('selectNumber', { code, number, bySocket: socket.id, byIdx: idx });

      if (!game || !game.started || game.winner !== null) {
        console.log('Game invalid or ended:', { code, exists: !!game, started: game?.started, winner: game?.winner });
        return;
      }

      if (game.turn !== idx) {
        console.log('Not player turn', { currentTurn: game.turn, playerIdx: idx });
        return;
      }

      // prevent duplicate calls
      if (game.calledNumbers.includes(number)) {
        console.log('Number already called:', number);
        return;
      }

      // mark number on both boards (if present) and record call
      let numberFound = false;
      for (let p = 0; p < game.players.length; p++) {
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            if (game.players[p].board[i][j] === number) {
              game.players[p].marked[i][j] = true;
              numberFound = true;
            }
          }
        }
      }

      // record move & calledNumbers (game global list)
      game.moves.push({ number, by: idx });
      game.calledNumbers.push(number);

      // Recalculate lines for each player
      for (let p = 0; p < game.players.length; p++) {
        game.players[p].lines = countCompletedLines(game.players[p].marked);
      }

      // clear interval timer for current turn
      if (game.timer) {
        clearInterval(game.timer);
        game.timer = null;
      }

      // Check for winner(s)
      const linesArr = game.players.map(p => p.lines);
      const playersWith5 = [];
      for (let p = 0; p < game.players.length; p++) {
        if (linesArr[p] >= 5) playersWith5.push(p);
      }

      if (playersWith5.length > 0) {
        // If both reached 5 on same move, tie-break: last caller wins (idx)
        // If only one reached >=5, that one wins.
        let winnerIdx = playersWith5.length === 1 ? playersWith5[0] : idx;
        const winnerByLastCall = playersWith5.length > 1;

        game.winner = winnerIdx;

        io.to(code).emit('gameEnd', {
          winner: winnerIdx,                      // 0 or 1
          winnerByLastCall,                       // true if tie-break used
          lastCallBy: idx,                        // who made this call
          boards: game.players.map(p => p.board),
          marked: game.players.map(p => p.marked),
          lines: game.players.map(p => p.lines),
          moves: game.moves,
          calledNumbers: game.calledNumbers,
        });

        delete games[code];
        return;
      }

      // No winner: switch turn
      game.turn = 1 - game.turn;

      // Emit move so both clients update (server is source of truth)
      io.to(code).emit('move', {
        number,
        by: idx,
        turn: game.turn,
        marked: game.players.map(p => p.marked),
        lines: game.players.map(p => p.lines),
        calledNumbers: game.calledNumbers,
        skipped: false,
      });

      // Start new turn timer
      startTurnTimer(io, code);
    });

    // --- Disconnect handling ---
    socket.on('disconnect', () => {
      const code = socket.data.gameCode;
      if (!code || !games[code]) return;
      const game = games[code];

      // clear any timer
      if (game.timer) {
        clearInterval(game.timer);
        game.timer = null;
      }

      // notify remaining player(s) — winner null indicates abort/disconnect
      io.to(code).emit('gameEnd', {
        winner: null,
        winnerByLastCall: false,
        lastCallBy: null,
        boards: game.players.map(p => p.board),
        marked: game.players.map(p => p.marked),
        lines: game.players.map(p => p.lines ?? 0),
        moves: game.moves,
        calledNumbers: game.calledNumbers,
        reason: 'A player disconnected.',
      });

      delete games[code];
    });
  });
}

/**
 * Timer per turn: emits 'timer' events and if expired, skips turn and emits a 'move' (skipped: true)
 */
function startTurnTimer(io, code) {
  const game = games[code];
  if (!game) return;

  let timeLeft = 30;
  io.to(code).emit('timer', { timeLeft });

  game.timer = setInterval(() => {
    timeLeft--;
    io.to(code).emit('timer', { timeLeft });

    if (timeLeft <= 0) {
      clearInterval(game.timer);
      game.timer = null;

      // Skip current player's turn
      game.turn = 1 - game.turn;

      // record a skipped move (no number)
      game.moves.push({ number: null, by: null });

      io.to(code).emit('move', {
        number: null,
        by: null,
        turn: game.turn,
        marked: game.players.map(p => p.marked),
        lines: game.players.map(p => p.lines ?? 0),
        calledNumbers: game.calledNumbers,
        skipped: true,
      });

      // restart timer for next player
      startTurnTimer(io, code);
    }
  }, 1000);
}
