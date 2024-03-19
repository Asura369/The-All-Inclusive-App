import React, { useState, useEffect, useRef } from 'react'
import './SnakeGame.css'

const SnakeGame = () => {
    const [score, setScore] = useState(0) // State for current score
    const [highscore, setHighscore] = useState(0) // State for high score
    const [snake, setSnake] = useState([]) // State for snake positions
    const [food, setFood] = useState({}) // State for food position
    const [direction, setDirection] = useState('RIGHT') // State for snake direction
    const [gameOver, setGameOver] = useState(false) // State for gameover status
    const [width, setWidth] = useState(0) // State for game board width
    const [height, setHeight] = useState(0) // State for game board height

    const gameBoardRef = useRef(null) // Reference to the game board element

    // Effect to initialize game board width and height
    useEffect(() => {
        const gameBoard = gameBoardRef.current
        if (gameBoard) {
            setWidth(gameBoard.offsetWidth)
            setHeight(gameBoard.offsetHeight)
        }
    }, [])

    // Effect to move snake at set intervals
    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(moveSnake, 100) // Set interval to call moveSnake function
            return () => clearInterval(interval) // Clear interval when re-render
        }
    }, [snake, gameOver])

    // Effect to change snake direction base on keyboard input
    useEffect(() => {
        const handleKeyPress = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    if (direction !== 'DOWN') setDirection('UP')
                    break
                case 'ArrowDown':
                    if (direction !== 'UP') setDirection('DOWN')
                    break
                case 'ArrowLeft':
                    if (direction !== 'RIGHT') setDirection('LEFT')
                    break
                case 'ArrowRight':
                    if (direction !== 'LEFT') setDirection('RIGHT')
                    break
                default:
                    break
            }
        }

        document.addEventListener('keydown', handleKeyPress) // Event listener for keyboard input
        return () => {
            document.removeEventListener('keydown', handleKeyPress) // Remove event listener on re-render
        }
    }, [direction])

    // Effect to initialize the game
    useEffect(() => {
        initializeGame()
    }, [])

    // Function to initialize/reset the game state
    const initializeGame = () => {
        const initialSnake = [{ x: 10, y: 10 }]
        setSnake(initialSnake)
        generateFood()
        setDirection('RIGHT')
        setScore(0)
        setGameOver(false)
    }

    // Function to generate random food position
    const generateFood = () => {
        const newFood = {
            x: Math.floor(Math.random() * (width / 10)),
            y: Math.floor(Math.random() * (height / 10))
        }
        setFood(newFood)
    }

    // Function to move snake
    const moveSnake = () => {
        if (!gameOver) {
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
                head.x >= width / 10 || // Or if head goes out of right boundary
                head.y < 0 || // Or if head goes out of top boundary
                head.y >= height / 10 || // Or if head goes out of bottom boundary
                checkCollision(head, newSnake) // Or if head collides with snake body
            ) {
                endGame() // End the game
                return
            }

            newSnake.unshift(head) // Add the new head position to front of snake array

            if (head.x === food.x && head.y === food.y) {
                // If the snake eats the food
                setScore(score + 1)
                generateFood()
            } else {
                newSnake.pop() // Remove the tail of the snake
            }

            setSnake(newSnake) // Update snake state with new position
        }
    }

    // Function to check if the snake head collides with its body
    const checkCollision = (head, snake) => {
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true
            }
        }
        return false
    }

    // Function to end the game
    const endGame = () => {
        setGameOver(true)
        if (score > highscore) {
            setHighscore(score)
        }
    }

    return (
        <div className="snake-game-container">
            <h3>Snake Game</h3>
            <pre>Use arrow keys to move</pre>
            <div id="game_board" ref={gameBoardRef} className="board">
                {snake.map((segment, index) => (
                    <div
                        key={index}
                        className="snake-segment"
                        style={{
                            left: `${segment.x * 10}px`,
                            top: `${segment.y * 10}px`
                        }}
                    />
                ))}
                <div
                    className="food"
                    style={{
                        left: `${food.x * 10}px`,
                        top: `${food.y * 10}px`
                    }}
                />
            </div>
            <pre>
                Current Score: {score}
                &nbsp;&nbsp;&nbsp;&nbsp; High Score: {highscore}
            </pre>
            {gameOver && (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <button
                        className="play-again-button"
                        onClick={initializeGame}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    )
}

export default SnakeGame
