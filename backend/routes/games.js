import express from 'express';
import Game from '../models/Game.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate Bingo board
const generateBingoBoard = () => {
  const board = [];
  const numbers = [];
  
  // Generate 25 unique numbers (1-75 for standard Bingo)
  while (numbers.length < 25) {
    const num = Math.floor(Math.random() * 75) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  
  // Arrange in 5x5 grid
  for (let i = 0; i < 5; i++) {
    board.push(numbers.slice(i * 5, (i + 1) * 5));
  }
  
  return board;
};

// @desc    Start a new game
// @route   POST /api/games/start
// @access  Private
router.post('/start', protect, async (req, res) => {
  try {
    const { gameType = 'classic', difficulty = 'medium' } = req.body;

    // Check if user has an active game
    const activeGame = await Game.findOne({
      player: req.user._id,
      status: 'active'
    });

    if (activeGame) {
      return res.status(400).json({
        error: 'Active game exists',
        message: 'You already have an active game. Please finish it first.'
      });
    }

    // Generate new board
    const board = generateBingoBoard();

    // Create new game
    const game = new Game({
      player: req.user._id,
      gameType,
      difficulty,
      board
    });

    await game.save();

    res.status(201).json({
      success: true,
      message: 'Game started successfully',
      data: {
        game: {
          id: game._id,
          gameType: game.gameType,
          difficulty: game.difficulty,
          board: game.board,
          status: game.status,
          startTime: game.startTime
        }
      }
    });
  } catch (error) {
    console.error('Start game error:', error);
    res.status(500).json({
      error: 'Failed to start game',
      message: 'Something went wrong'
    });
  }
});

// @desc    Get current game
// @route   GET /api/games/current
// @access  Private
router.get('/current', protect, async (req, res) => {
  try {
    const game = await Game.findOne({
      player: req.user._id,
      status: 'active'
    });

    if (!game) {
      return res.status(404).json({
        error: 'No active game',
        message: 'You don\'t have an active game'
      });
    }

    res.json({
      success: true,
      data: {
        game: {
          id: game._id,
          gameType: game.gameType,
          difficulty: game.difficulty,
          board: game.board,
          calledNumbers: game.calledNumbers,
          markedNumbers: game.markedNumbers,
          status: game.status,
          startTime: game.startTime,
          progress: game.getProgress()
        }
      }
    });
  } catch (error) {
    console.error('Get current game error:', error);
    res.status(500).json({
      error: 'Failed to get current game',
      message: 'Something went wrong'
    });
  }
});

// @desc    Make a move (call or mark number)
// @route   POST /api/games/:id/move
// @access  Private
router.post('/:id/move', protect, async (req, res) => {
  try {
    const { number, action } = req.body;
    const gameId = req.params.id;

    const game = await Game.findOne({
      _id: gameId,
      player: req.user._id,
      status: 'active'
    });

    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        message: 'Game not found or not active'
      });
    }

    // Validate action
    if (!['call', 'mark', 'unmark'].includes(action)) {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Action must be call, mark, or unmark'
      });
    }

    // Validate number
    if (!number || number < 1 || number > 75) {
      return res.status(400).json({
        error: 'Invalid number',
        message: 'Number must be between 1 and 75'
      });
    }

    // Check if number exists on board
    const boardNumbers = game.board.flat();
    if (!boardNumbers.includes(number)) {
      return res.status(400).json({
        error: 'Number not on board',
        message: 'This number is not on your board'
      });
    }

    // Process move
    if (action === 'call') {
      if (game.calledNumbers.includes(number)) {
        return res.status(400).json({
          error: 'Number already called',
          message: 'This number has already been called'
        });
      }
      game.calledNumbers.push(number);
    } else if (action === 'mark') {
      if (game.markedNumbers.includes(number)) {
        return res.status(400).json({
          error: 'Number already marked',
          message: 'This number is already marked'
        });
      }
      game.markedNumbers.push(number);
    } else if (action === 'unmark') {
      const index = game.markedNumbers.indexOf(number);
      if (index === -1) {
        return res.status(400).json({
          error: 'Number not marked',
          message: 'This number is not marked'
        });
      }
      game.markedNumbers.splice(index, 1);
    }

    // Add move to history
    await game.addMove(number, action);

    // Check for win condition
    const isWon = checkWinCondition(game.board, game.markedNumbers);
    
    if (isWon) {
      await game.endGame(true, calculateScore(game));
      
      // Update user stats
      await req.user.updateStats({
        won: true,
        score: game.score,
        time: game.duration
      });

      return res.json({
        success: true,
        message: 'Congratulations! You won!',
        data: {
          game: {
            id: game._id,
            won: true,
            score: game.score,
            duration: game.duration,
            finalBoard: game.board,
            markedNumbers: game.markedNumbers
          }
        }
      });
    }

    res.json({
      success: true,
      message: 'Move made successfully',
      data: {
        game: {
          id: game._id,
          calledNumbers: game.calledNumbers,
          markedNumbers: game.markedNumbers,
          progress: game.getProgress()
        }
      }
    });
  } catch (error) {
    console.error('Make move error:', error);
    res.status(500).json({
      error: 'Failed to make move',
      message: 'Something went wrong'
    });
  }
});

// @desc    End current game
// @route   POST /api/games/:id/end
// @access  Private
router.post('/:id/end', protect, async (req, res) => {
  try {
    const gameId = req.params.id;
    const { won = false } = req.body;

    const game = await Game.findOne({
      _id: gameId,
      player: req.user._id,
      status: 'active'
    });

    if (!game) {
      return res.status(404).json({
        error: 'Game not found',
        message: 'Game not found or not active'
      });
    }

    const score = won ? calculateScore(game) : 0;
    await game.endGame(won, score);

    // Update user stats
    await req.user.updateStats({
      won,
      score,
      time: game.duration
    });

    res.json({
      success: true,
      message: won ? 'Game completed successfully!' : 'Game ended',
      data: {
        game: {
          id: game._id,
          won: game.won,
          score: game.score,
          duration: game.duration,
          finalBoard: game.board,
          markedNumbers: game.markedNumbers
        }
      }
    });
  } catch (error) {
    console.error('End game error:', error);
    res.status(500).json({
      error: 'Failed to end game',
      message: 'Something went wrong'
    });
  }
});

// Helper function to check win condition
const checkWinCondition = (board, markedNumbers) => {
  // Check rows
  for (let i = 0; i < 5; i++) {
    if (board[i].every(num => markedNumbers.includes(num))) {
      return true;
    }
  }

  // Check columns
  for (let j = 0; j < 5; j++) {
    if (board.every(row => markedNumbers.includes(row[j]))) {
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] && board[1][1] && board[2][2] && board[3][3] && board[4][4]) {
    if (markedNumbers.includes(board[0][0]) && 
        markedNumbers.includes(board[1][1]) && 
        markedNumbers.includes(board[2][2]) && 
        markedNumbers.includes(board[3][3]) && 
        markedNumbers.includes(board[4][4])) {
      return true;
    }
  }

  if (board[0][4] && board[1][3] && board[2][2] && board[3][1] && board[4][0]) {
    if (markedNumbers.includes(board[0][4]) && 
        markedNumbers.includes(board[1][3]) && 
        markedNumbers.includes(board[2][2]) && 
        markedNumbers.includes(board[3][1]) && 
        markedNumbers.includes(board[4][0])) {
      return true;
    }
  }

  return false;
};

// Helper function to calculate score
const calculateScore = (game) => {
  const baseScore = 100;
  const timeBonus = Math.max(0, 300 - game.duration) * 2; // Bonus for faster completion
  const markedBonus = game.markedNumbers.length * 5; // Bonus for each marked number
  
  return baseScore + timeBonus + markedBonus;
};

export default router; 