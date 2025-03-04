import React, { useState, useEffect, useRef } from 'react'
import './SnakeGame.css'

// Define food types with their properties
const FOOD_TYPES = {
    REGULAR: { color: '#e74c3c', points: 1, probability: 0.7 },
    BONUS: { color: '#f39c12', points: 3, probability: 0.2 },
    SUPER: { color: '#9b59b6', points: 5, probability: 0.1 }
}

// Define difficulty levels with their speeds (milliseconds between moves)
const DIFFICULTY_LEVELS = {
    EASY: { name: 'Easy', speed: 150 },
    MEDIUM: { name: 'Medium', speed: 100 },
    HARD: { name: 'Hard', speed: 70 },
    NIGHTMARE: { name: 'Nightmare', speed: 40 }
}

// Define constants for the game
const CELL_SIZE = 15 // Size of each cell in pixels (increased from 10)
const GRID_SIZE = 35 // Number of cells in each dimension (35x35 grid)

const SnakeGame = () => {
    const [score, setScore] = useState(0) // State for current score
    const [highscore, setHighscore] = useState(0) // State for high score
    const [snake, setSnake] = useState([]) // State for snake positions
    const [food, setFood] = useState({}) // State for food position
    const [direction, setDirection] = useState('RIGHT') // State for snake direction
    const [gameOver, setGameOver] = useState(false) // State for gameover status
    const [width, setWidth] = useState(GRID_SIZE * CELL_SIZE) // State for game board width
    const [height, setHeight] = useState(GRID_SIZE * CELL_SIZE) // State for game board height
    const [isPaused, setIsPaused] = useState(false) // State for game pause status
    const [foodType, setFoodType] = useState(FOOD_TYPES.REGULAR) // State for current food type
    const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM) // State for difficulty level
    const [timePlayed, setTimePlayed] = useState(0) // State for time played

    const gameBoardRef = useRef(null) // Reference to the game board element
    const gameSpeedRef = useRef(null) // Reference to track the current game speed
    const lastDirectionRef = useRef('RIGHT') // Reference to track the last direction
    const gameTimerRef = useRef(null) // Reference for game timer
    const gameStartTimeRef = useRef(null) // Reference to track game start time

    // Effect to initialize game board width and height
    useEffect(() => {
        const gameBoard = gameBoardRef.current
        if (gameBoard) {
            // Use fixed size based on GRID_SIZE and CELL_SIZE
            setWidth(GRID_SIZE * CELL_SIZE)
            setHeight(GRID_SIZE * CELL_SIZE)
        }
    }, [])

    // Effect to move snake at set intervals based on difficulty
    useEffect(() => {
        if (!gameOver && !isPaused) {
            const interval = setInterval(moveSnake, difficulty.speed) // Set interval based on difficulty
            gameSpeedRef.current = interval // Store the interval ID
            return () => clearInterval(interval) // Clear interval when re-render
        }
    }, [snake, gameOver, isPaused, difficulty]) // eslint-disable-line

    // Effect to update game timer
    useEffect(() => {
        if (!gameOver && !isPaused) {
            if (!gameStartTimeRef.current) {
                gameStartTimeRef.current = Date.now()
            }

            gameTimerRef.current = setInterval(() => {
                const currentTime = Math.floor(
                    (Date.now() - gameStartTimeRef.current) / 1000
                )
                setTimePlayed(currentTime)
            }, 1000)

            return () => {
                clearInterval(gameTimerRef.current)
            }
        }
    }, [gameOver, isPaused])

    // Effect to change snake direction and handle keyboard controls
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Prevent default behavior for arrow keys to avoid page scrolling
            if (
                ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
                    event.key
                )
            ) {
                event.preventDefault()
            }

            // Pause/Resume with 'p' key
            if (event.key === 'p' || event.key === 'P') {
                setIsPaused((prev) => !prev)
                return
            }

            // Restart with 'r' key
            if (event.key === 'r' || event.key === 'R') {
                initializeGame()
                return
            }

            if (isPaused || gameOver) return // Don't process movement keys if paused or game over

            let newDirection = direction

            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') newDirection = 'UP'
                    break
                case 'ArrowDown':
                    if (direction !== 'UP') newDirection = 'DOWN'
                    break
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') newDirection = 'LEFT'
                    break
                case 'ArrowRight':
                    if (direction !== 'LEFT') newDirection = 'RIGHT'
                    break
                default:
                    break
            }

            if (newDirection !== direction) {
                setDirection(newDirection)
            }
        }

        document.addEventListener('keydown', handleKeyPress) // Event listener for keyboard input
        return () => {
            document.removeEventListener('keydown', handleKeyPress) // Remove event listener on re-render
        }
    }, [direction, isPaused, gameOver])

    // Effect to initialize the game
    useEffect(() => {
        initializeGame()

        // Load high score from localStorage if available
        const savedHighScore = localStorage.getItem('snakeGameHighScore')
        if (savedHighScore) {
            setHighscore(parseInt(savedHighScore, 10))
        }

        return () => {
            clearInterval(gameTimerRef.current)
        }
    }, []) // eslint-disable-line

    // Function to format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    // Function to initialize/reset the game state
    const initializeGame = () => {
        // Start snake in the middle of the grid
        const initialSnake = [
            { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
        ]
        setSnake(initialSnake)
        generateFood(initialSnake)
        setDirection('RIGHT')
        lastDirectionRef.current = 'RIGHT'
        setScore(0)
        setGameOver(false)
        setIsPaused(false)
        setTimePlayed(0)

        // Reset game timer
        clearInterval(gameTimerRef.current)
        gameStartTimeRef.current = Date.now()
    }

    // Function to handle difficulty change
    const handleDifficultyChange = (e) => {
        const selectedDifficulty = e.target.value
        setDifficulty(DIFFICULTY_LEVELS[selectedDifficulty])

        // If the game is in progress, restart it with the new difficulty
        if (!gameOver && snake.length > 1) {
            initializeGame()
        }
    }

    // Function to determine food type based on probabilities
    const determineFoodType = () => {
        const random = Math.random()
        if (random < FOOD_TYPES.REGULAR.probability) {
            return FOOD_TYPES.REGULAR
        } else if (
            random <
            FOOD_TYPES.REGULAR.probability + FOOD_TYPES.BONUS.probability
        ) {
            return FOOD_TYPES.BONUS
        } else {
            return FOOD_TYPES.SUPER
        }
    }

    // Function to check if a position is occupied by the snake
    const isPositionOccupied = (pos, snakeArray) => {
        return snakeArray.some(
            (segment) => segment.x === pos.x && segment.y === pos.y
        )
    }

    // Function to generate random food position
    const generateFood = (currentSnake = snake) => {
        let newFood
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            }
        } while (isPositionOccupied(newFood, currentSnake))

        setFood(newFood)
        setFoodType(determineFoodType())
    }

    // Function to move snake
    const moveSnake = () => {
        if (!gameOver && !isPaused) {
            const newSnake = [...snake] // Create copy of the current snake position
            const head = { ...newSnake[0] } // Get the current head of snake

            switch (direction) {
                case 'UP':
                    head.y -= 1
                    break
                case 'DOWN':
                    head.y += 1
                    break
                case 'LEFT':
                    head.x -= 1
                    break
                case 'RIGHT':
                    head.x += 1
                    break
                default:
                    break
            }

            if (
                head.x < 0 || // If head goes out of left boundary
                head.x >= GRID_SIZE || // Or if head goes out of right boundary
                head.y < 0 || // Or if head goes out of top boundary
                head.y >= GRID_SIZE || // Or if head goes out of bottom boundary
                checkCollision(head, newSnake) // Or if head collides with snake body
            ) {
                endGame() // End the game
                return
            }

            newSnake.unshift(head) // Add the new head position to front of snake array

            if (head.x === food.x && head.y === food.y) {
                // If the snake eats the food
                setScore(score + foodType.points)
                generateFood(newSnake)
            } else {
                newSnake.pop() // Remove the tail of the snake
            }

            setSnake(newSnake) // Update snake state with new position
            lastDirectionRef.current = direction // Update last direction
        }
    }

    // Function to check if the snake head collides with its body
    const checkCollision = (head, snake) => {
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true
            }
        }
        return false
    }

    // Function to end the game
    const endGame = () => {
        setGameOver(true)

        // Clear game timer
        clearInterval(gameTimerRef.current)

        if (score > highscore) {
            setHighscore(score)
            // Save high score to localStorage
            localStorage.setItem('snakeGameHighScore', score.toString())
        }
    }

    return (
        <div className="snake-game-container">
            <h3>Snake Game</h3>
            <div className="game-instructions">
                Use arrow keys to move • Press P to pause/resume • Press R to
                restart
            </div>

            <div className="game-layout">
                <div className="game-board-container">
                    <div id="game_board" ref={gameBoardRef} className="board">
                        {isPaused && !gameOver && (
                            <div className="game-over">
                                <h2>Game Paused</h2>
                                <p>Press P to resume</p>
                            </div>
                        )}
                        {gameOver && (
                            <div className="game-over">
                                <h2>Game Over</h2>
                                <div className="game-over-stats">
                                    <p>Final Score: {score}</p>
                                    <p>Snake Length: {snake.length}</p>
                                    <p>Time Played: {formatTime(timePlayed)}</p>
                                </div>
                                <p>Press R to play again</p>
                            </div>
                        )}
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className={`snake-segment ${
                                    index === 0 ? 'snake-head' : ''
                                }`}
                                style={{
                                    left: `${segment.x * CELL_SIZE}px`,
                                    top: `${segment.y * CELL_SIZE}px`,
                                    width: `${CELL_SIZE}px`,
                                    height: `${CELL_SIZE}px`
                                }}
                            />
                        ))}
                        <div
                            className="food"
                            style={{
                                left: `${food.x * CELL_SIZE}px`,
                                top: `${food.y * CELL_SIZE}px`,
                                width: `${CELL_SIZE}px`,
                                height: `${CELL_SIZE}px`,
                                backgroundColor: foodType.color
                            }}
                        />
                    </div>
                </div>

                <div className="game-controls">
                    <div className="game-info">
                        <div className="score-display">
                            <div className="score-item">
                                <span className="score-label">Score:</span>
                                <span className="score-value">{score}</span>
                            </div>
                            <div className="score-item">
                                <span className="score-label">High Score:</span>
                                <span className="score-value">{highscore}</span>
                            </div>
                            <div className="score-item">
                                <span className="score-label">Speed:</span>
                                <span className="score-value">
                                    {difficulty.name}
                                </span>
                            </div>
                            <div className="score-item">
                                <span className="score-label">Time:</span>
                                <span className="score-value">
                                    {formatTime(timePlayed)}
                                </span>
                            </div>
                        </div>

                        <div className="difficulty-selector">
                            <label htmlFor="difficulty">Difficulty: </label>
                            <select
                                id="difficulty"
                                value={Object.keys(DIFFICULTY_LEVELS).find(
                                    (key) =>
                                        DIFFICULTY_LEVELS[key] === difficulty
                                )}
                                onChange={handleDifficultyChange}
                                disabled={
                                    !gameOver && snake.length > 1 && !isPaused
                                }
                            >
                                {Object.keys(DIFFICULTY_LEVELS).map((level) => (
                                    <option key={level} value={level}>
                                        {DIFFICULTY_LEVELS[level].name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="food-legend">
                            <h4>Food Types</h4>
                            <div className="legend-item">
                                <div
                                    className="food-sample"
                                    style={{
                                        backgroundColor:
                                            FOOD_TYPES.REGULAR.color
                                    }}
                                ></div>
                                <span>
                                    Regular: {FOOD_TYPES.REGULAR.points} point
                                </span>
                            </div>
                            <div className="legend-item">
                                <div
                                    className="food-sample"
                                    style={{
                                        backgroundColor: FOOD_TYPES.BONUS.color
                                    }}
                                ></div>
                                <span>
                                    Bonus: {FOOD_TYPES.BONUS.points} points
                                </span>
                            </div>
                            <div className="legend-item">
                                <div
                                    className="food-sample"
                                    style={{
                                        backgroundColor: FOOD_TYPES.SUPER.color
                                    }}
                                ></div>
                                <span>
                                    Super: {FOOD_TYPES.SUPER.points} points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SnakeGame
