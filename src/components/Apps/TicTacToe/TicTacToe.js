import React, { useState, useEffect, useRef } from 'react'
import './TicTacToe.css'

// Game modes
const GAME_MODES = {
    HUMAN_VS_HUMAN: { id: 'HUMAN_VS_HUMAN', name: 'Human vs Human' },
    HUMAN_VS_AI: { id: 'HUMAN_VS_AI', name: 'Human vs AI' }
}

// AI difficulty levels
const AI_DIFFICULTY = {
    EASY: { id: 'EASY', name: 'Easy' },
    MEDIUM: { id: 'MEDIUM', name: 'Medium' },
    HARD: { id: 'HARD', name: 'Hard' }
}

const TicTacToe = () => {
    // Game state
    const [board, setBoard] = useState(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [winner, setWinner] = useState(null)
    const [gameHistory, setGameHistory] = useState({
        human: 0,
        ai: 0,
        player1: 0,
        player2: 0,
        ties: 0
    })
    const [gameMode, setGameMode] = useState(GAME_MODES.HUMAN_VS_HUMAN)
    const [aiDifficulty, setAiDifficulty] = useState(AI_DIFFICULTY.MEDIUM)
    const [isGameActive, setIsGameActive] = useState(true)
    const [aiStarts, setAiStarts] = useState(false)
    const [isAiThinking, setIsAiThinking] = useState(false)

    // Refs
    const gameBoardRef = useRef(null)
    const aiTimeoutRef = useRef(null)

    // Calculate winner
    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], // top row
            [3, 4, 5], // middle row
            [6, 7, 8], // bottom row
            [0, 3, 6], // left column
            [1, 4, 7], // middle column
            [2, 5, 8], // right column
            [0, 4, 8], // diagonal
            [2, 4, 6] // diagonal
        ]

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a]
            }
        }

        // Check for tie (all squares filled)
        if (squares.every((square) => square !== null)) {
            return 'tie'
        }

        return null
    }

    // Handle click on a square
    const handleClick = (index) => {
        // Don't allow clicks if there's a winner, square is already filled, game is not active, or AI is thinking
        if (
            winner ||
            board[index] ||
            !isGameActive ||
            isAiThinking ||
            (gameMode.id === 'HUMAN_VS_AI' &&
                ((isXNext && aiStarts) || (!isXNext && !aiStarts)))
        ) {
            return
        }

        const newBoard = [...board]
        newBoard[index] = isXNext ? 'X' : 'O'

        setBoard(newBoard)
        setIsXNext(!isXNext)
    }

    // AI move logic
    const makeAiMove = () => {
        if (winner || !isGameActive) return

        // Set AI thinking state
        setIsAiThinking(true)

        // Clear any existing timeout
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current)
        }

        aiTimeoutRef.current = setTimeout(() => {
            const newBoard = [...board]
            let moveIndex

            switch (aiDifficulty.id) {
                case 'HARD':
                    moveIndex = getBestMove(newBoard, aiStarts ? 'X' : 'O')
                    break
                case 'MEDIUM':
                    // 70% chance of making the best move, 30% chance of random move
                    moveIndex =
                        Math.random() < 0.7
                            ? getBestMove(newBoard, aiStarts ? 'X' : 'O')
                            : getRandomMove(newBoard)
                    break
                case 'EASY':
                default:
                    // 30% chance of making the best move, 70% chance of random move
                    moveIndex =
                        Math.random() < 0.3
                            ? getBestMove(newBoard, aiStarts ? 'X' : 'O')
                            : getRandomMove(newBoard)
                    break
            }

            if (moveIndex !== null) {
                newBoard[moveIndex] = aiStarts ? 'X' : 'O'
                setBoard(newBoard)
                setIsXNext(!aiStarts)
            }

            // Reset AI thinking state
            setIsAiThinking(false)
        }, 800) // Slightly longer delay to make AI move feel more natural
    }

    // Get a random valid move
    const getRandomMove = (currentBoard) => {
        const availableMoves = currentBoard
            .map((square, index) => (square === null ? index : null))
            .filter((index) => index !== null)

        if (availableMoves.length === 0) return null

        return availableMoves[Math.floor(Math.random() * availableMoves.length)]
    }

    // Minimax algorithm for AI
    const minimax = (board, depth, isMaximizing, player, opponent) => {
        const result = calculateWinner(board)

        // Terminal states
        if (result === player) return 10 - depth
        if (result === opponent) return depth - 10
        if (result === 'tie') return 0

        if (isMaximizing) {
            let bestScore = -Infinity
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = player
                    const score = minimax(
                        board,
                        depth + 1,
                        false,
                        player,
                        opponent
                    )
                    board[i] = null
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            for (let i = 0; i < board.length; i++) {
                if (board[i] === null) {
                    board[i] = opponent
                    const score = minimax(
                        board,
                        depth + 1,
                        true,
                        player,
                        opponent
                    )
                    board[i] = null
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    }

    // Get the best move using minimax
    const getBestMove = (currentBoard, player) => {
        const opponent = player === 'X' ? 'O' : 'X'
        let bestScore = -Infinity
        let bestMove = null

        for (let i = 0; i < currentBoard.length; i++) {
            if (currentBoard[i] === null) {
                currentBoard[i] = player
                const score = minimax(currentBoard, 0, false, player, opponent)
                currentBoard[i] = null

                if (score > bestScore) {
                    bestScore = score
                    bestMove = i
                }
            }
        }

        return bestMove
    }

    // Handle keyboard controls
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Prevent default behavior for arrow keys and space
            if (
                [
                    'ArrowUp',
                    'ArrowDown',
                    'ArrowLeft',
                    'ArrowRight',
                    ' '
                ].includes(event.key)
            ) {
                event.preventDefault()
            }

            // Reset game when 'r' is pressed
            if (event.key.toLowerCase() === 'r') {
                resetGame()
            }
        }

        window.addEventListener('keydown', handleKeyPress)

        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Clean up AI timeout on unmount
    useEffect(() => {
        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current)
            }
        }
    }, [])

    // Check for winner after each move
    useEffect(() => {
        const result = calculateWinner(board)
        if (result) {
            setWinner(result)
            setIsGameActive(false)
            setIsAiThinking(false)

            // Update game history
            if (result === 'tie') {
                setGameHistory((prev) => ({ ...prev, ties: prev.ties + 1 }))
            } else if (gameMode.id === 'HUMAN_VS_AI') {
                // In AI mode, determine winner based on who started
                if (
                    (result === 'X' && !aiStarts) ||
                    (result === 'O' && aiStarts)
                ) {
                    setGameHistory((prev) => ({
                        ...prev,
                        human: prev.human + 1
                    }))
                } else {
                    setGameHistory((prev) => ({
                        ...prev,
                        ai: prev.ai + 1
                    }))
                }
            } else {
                // In human vs human mode
                if (result === 'X') {
                    setGameHistory((prev) => ({
                        ...prev,
                        player1: prev.player1 + 1
                    }))
                } else {
                    setGameHistory((prev) => ({
                        ...prev,
                        player2: prev.player2 + 1
                    }))
                }
            }
        } else if (gameMode.id === 'HUMAN_VS_AI' && !winner && isGameActive) {
            // AI's turn
            if ((isXNext && aiStarts) || (!isXNext && !aiStarts)) {
                makeAiMove()
            }
        }
    }, [board, isXNext]) // eslint-disable-line react-hooks/exhaustive-deps

    // Handle game mode change
    const handleGameModeChange = (e) => {
        const selectedMode = Object.values(GAME_MODES).find(
            (mode) => mode.id === e.target.value
        )
        setGameMode(selectedMode)
        resetGame()
    }

    // Handle AI difficulty change
    const handleAiDifficultyChange = (e) => {
        const selectedDifficulty = Object.values(AI_DIFFICULTY).find(
            (difficulty) => difficulty.id === e.target.value
        )
        setAiDifficulty(selectedDifficulty)
    }

    // Reset the game
    const resetGame = () => {
        // Clear any AI timeout
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current)
        }

        setBoard(Array(9).fill(null))
        setIsAiThinking(false)

        // If in AI mode, randomly determine who goes first
        if (gameMode.id === 'HUMAN_VS_AI') {
            const aiGoesFirst = Math.random() < 0.5
            setAiStarts(aiGoesFirst)
            setIsXNext(!aiGoesFirst) // If AI starts, human is not next (O)
        } else {
            setIsXNext(true) // In human vs human, X always starts
        }

        setWinner(null)
        setIsGameActive(true)
    }

    // Render a square
    const renderSquare = (index) => {
        // Determine if square should be disabled
        const isDisabled =
            winner ||
            board[index] ||
            !isGameActive ||
            isAiThinking ||
            (gameMode.id === 'HUMAN_VS_AI' &&
                ((isXNext && aiStarts) || (!isXNext && !aiStarts)))

        return (
            <button
                className={`square ${board[index]} ${
                    isDisabled ? 'disabled' : ''
                }`}
                onClick={() => handleClick(index)}
            >
                {board[index]}
            </button>
        )
    }

    // Status message
    const getStatus = () => {
        if (winner === 'tie') {
            return 'Game ended in a tie!'
        } else if (winner) {
            if (gameMode.id === 'HUMAN_VS_AI') {
                return (winner === 'X' && !aiStarts) ||
                    (winner === 'O' && aiStarts)
                    ? 'Human Wins!'
                    : 'AI Wins!'
            } else {
                return `Player ${winner} Wins!`
            }
        } else {
            if (gameMode.id === 'HUMAN_VS_AI') {
                if (isAiThinking) {
                    return 'AI thinking...'
                }
                return (isXNext && !aiStarts) || (!isXNext && aiStarts)
                    ? 'Your turn'
                    : 'AI turn'
            } else {
                return `Next player: ${isXNext ? 'X' : 'O'}`
            }
        }
    }

    // Effect to make AI move if AI starts
    useEffect(() => {
        if (
            gameMode.id === 'HUMAN_VS_AI' &&
            aiStarts &&
            board.every((cell) => cell === null) &&
            isGameActive
        ) {
            // Set AI thinking state
            setIsAiThinking(true)

            // Clear any existing timeout
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current)
            }

            // Small delay to make it feel more natural
            aiTimeoutRef.current = setTimeout(() => {
                const moveIndex = getRandomMove(board)
                if (moveIndex !== null) {
                    const newBoard = [...board]
                    newBoard[moveIndex] = 'X'
                    setBoard(newBoard)
                    setIsXNext(false)
                }
                setIsAiThinking(false)
            }, 800)
        }
    }, [aiStarts, gameMode.id, isGameActive]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="tic-tac-toe-container">
            <h3>Tic Tac Toe</h3>
            <div className="game-instructions">
                Take turns placing X and O • First to get three in a row wins
            </div>

            <div className="game-layout">
                <div className="game-board-container" ref={gameBoardRef}>
                    <div className="game-board">
                        {winner && (
                            <div className="game-over">
                                <h2>
                                    {winner === 'tie'
                                        ? 'Game Tied!'
                                        : gameMode.id === 'HUMAN_VS_AI'
                                        ? (winner === 'X' && !aiStarts) ||
                                          (winner === 'O' && aiStarts)
                                            ? 'Human Wins!'
                                            : 'AI Wins!'
                                        : `Player ${winner} Wins!`}
                                </h2>
                                <div className="game-over-stats">
                                    {gameMode.id === 'HUMAN_VS_AI' ? (
                                        <>
                                            <p>
                                                Human Wins: {gameHistory.human}
                                            </p>
                                            <p>AI Wins: {gameHistory.ai}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>
                                                Player X Wins:{' '}
                                                {gameHistory.player1}
                                            </p>
                                            <p>
                                                Player O Wins:{' '}
                                                {gameHistory.player2}
                                            </p>
                                        </>
                                    )}
                                    <p>Ties: {gameHistory.ties}</p>
                                </div>
                            </div>
                        )}
                        <div className="board-row">
                            {renderSquare(0)}
                            {renderSquare(1)}
                            {renderSquare(2)}
                        </div>
                        <div className="board-row">
                            {renderSquare(3)}
                            {renderSquare(4)}
                            {renderSquare(5)}
                        </div>
                        <div className="board-row">
                            {renderSquare(6)}
                            {renderSquare(7)}
                            {renderSquare(8)}
                        </div>
                    </div>

                    <div className="button-container">
                        <button
                            className="play-again-button"
                            onClick={resetGame}
                        >
                            {winner ? 'Play Again' : 'Restart Game'}
                        </button>
                    </div>
                </div>

                <div className="game-controls">
                    <div className="game-info">
                        <div className="score-display">
                            <div className="score-item">
                                <span className="score-label">Status:</span>
                                <span className="score-value">
                                    {getStatus()}
                                </span>
                            </div>
                            {gameMode.id === 'HUMAN_VS_AI' ? (
                                <>
                                    <div className="score-item">
                                        <span className="score-label">
                                            Human Wins:
                                        </span>
                                        <span className="score-value">
                                            {gameHistory.human}
                                        </span>
                                    </div>
                                    <div className="score-item">
                                        <span className="score-label">
                                            AI Wins:
                                        </span>
                                        <span className="score-value">
                                            {gameHistory.ai}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="score-item">
                                        <span className="score-label">
                                            Player X Wins:
                                        </span>
                                        <span className="score-value">
                                            {gameHistory.player1}
                                        </span>
                                    </div>
                                    <div className="score-item">
                                        <span className="score-label">
                                            Player O Wins:
                                        </span>
                                        <span className="score-value">
                                            {gameHistory.player2}
                                        </span>
                                    </div>
                                </>
                            )}
                            <div className="score-item">
                                <span className="score-label">Ties:</span>
                                <span className="score-value">
                                    {gameHistory.ties}
                                </span>
                            </div>
                        </div>

                        <div className="game-mode-selector">
                            <label htmlFor="gameMode">Game Mode: </label>
                            <select
                                id="gameMode"
                                value={gameMode.id}
                                onChange={handleGameModeChange}
                            >
                                {Object.values(GAME_MODES).map((mode) => (
                                    <option key={mode.id} value={mode.id}>
                                        {mode.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {gameMode.id === 'HUMAN_VS_AI' && (
                            <div className="ai-difficulty-selector">
                                <label htmlFor="aiDifficulty">
                                    AI Difficulty:{' '}
                                </label>
                                <select
                                    id="aiDifficulty"
                                    value={aiDifficulty.id}
                                    onChange={handleAiDifficultyChange}
                                >
                                    {Object.values(AI_DIFFICULTY).map(
                                        (difficulty) => (
                                            <option
                                                key={difficulty.id}
                                                value={difficulty.id}
                                            >
                                                {difficulty.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TicTacToe
