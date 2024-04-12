// Required library for handling synchronous user input in the terminal environment.
const prompt = require('prompt-sync')({ sigint: true });

// Definitions of icons used within the game to represent different elements in the maze.
const hatIcon = '^'; // Represents the goal (hat) the player aims to reach.
const holeIcon = 'O'; // Represents obstacles (holes) that end the game if the player encounters them.
const fieldIcon = '░'; // Represents open fields that the player can move through.
const playerIcon = '*'; // Represents the player's current position in the maze.
// List of valid commands that the player can input to navigate through the maze.
const validInputs = ['u', 'd', 'l', 'r']; // Correspond to up, down, left, and right movements.

class MazeGame {
    constructor(fieldArray) {
        this._fieldArray = fieldArray; // 2D array representing the game field.
        this._gameState = true; // Boolean flag to control the ongoing state of the game.
        this._initIndex = [0, 0]; // Initial position of the player on the game field.
    }

    // Method to generate a maze with random placements of holes, player, and the hat.
    generateMaze(height, width, holesPercentage) {
        console.log(`Height: ${height} | Width: ${width} | Holes Percentage: ${holesPercentage}%`);
        
        let mazeArray = [];
        
        // Populate the maze with holes and field spaces based on the specified percentage.
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                const isHole = Math.random() < holesPercentage / 100;
                row.push(isHole ? holeIcon : fieldIcon);
            }
            mazeArray.push(row);
        }
    
        // Determine player's placement randomly along the maze edge.
        let edge = Math.floor(Math.random() * 4);
        let playerIndexX, playerIndexY;
    
        switch (edge) {
            case 0: // Top row
                playerIndexX = Math.floor(Math.random() * width);
                playerIndexY = 0;
                break;
            case 1: // Right column
                playerIndexX = width - 1;
                playerIndexY = Math.floor(Math.random() * height);
                break;
            case 2: // Bottom row
                playerIndexX = Math.floor(Math.random() * width);
                playerIndexY = height - 1;
                break;
            case 3: // Left column
                playerIndexX = 0;
                playerIndexY = Math.floor(Math.random() * height);
                break;
        }
    
        mazeArray[playerIndexY][playerIndexX] = playerIcon; // Mark the player's position on the maze.
    
        // Generate random coordinates for the hat, ensuring it's not placed on the player or a hole
        let hatIndexX, hatIndexY;
        do {
            hatIndexX = Math.floor(Math.random() * width);
            hatIndexY = Math.floor(Math.random() * height);
        } while ((hatIndexX === playerIndexX && hatIndexY === playerIndexY) || mazeArray[hatIndexY][hatIndexX] === holeIcon);
    
        mazeArray[hatIndexY][hatIndexX] = hatIcon; // Place the hat in the maze.
    
        // Print the generated maze with borders
        const border = '-'.repeat(width + 2);
        console.log(`${border}\n${mazeArray.map(arr => `|${arr.join('')}|`).join('\n')}\n${border}`);
    }   

    // Method to print the current state of the maze with a border.
    print() {
        // Creates a border based on the width of the maze.
        const border = '-'.repeat(this._fieldArray[0].length + 2);
        // Maps each row of the field to a string and joins them with newline characters.
        console.log(`${border}\n${this._fieldArray.map(arr => `|${arr.join('')}|`).join('\n')}\n${border}`);
    }

    // Method to capture and validate user input for movement direction.
    getUserInput() {
        // Instructions for the user on how to move in the game.
        const gameInstructions = `Use inputs of ('u' = up), ('d' = down), ('l' = left) or ('r' = right)`;
        const askDirection = 'Which way? ';
        const invalidInputMessage = 'Invalid input.';
        let direction = '';
        
        // Loop continues until a valid input is received.
        while (!validInputs.includes(direction)) {
            console.log(gameInstructions);
            direction = prompt(askDirection);
            if (!validInputs.includes(direction)) {
                console.log(invalidInputMessage);
            }
        }
        return direction;
    }

    // Updates the player's position based on the input direction.
    movePlayer(direction) {
        let playerPosition = this._initIndex;

        // Adjusts playerPosition based on the direction.
        switch (direction) {
            case 'r': playerPosition[1]++; break;
            case 'l': playerPosition[1]--; break;
            case 'u': playerPosition[0]--; break;
            case 'd': playerPosition[0]++; break;
        }

        return this._initIndex;
    }

    // Validates the player's new position after a move attempt.
    moveValidation(coordinates) {
        const [yIndex, xIndex] = coordinates;
        // Checks for out-of-bounds movement.
        if (yIndex < 0 || yIndex >= this._fieldArray.length || xIndex < 0 || xIndex >= this._fieldArray[0].length) {
            return {valid: false, message: 'Out of Bounds! Game Over!'};
        } 
        
        // Retrieves the icon at the new position.
        const gridSymbol = this._fieldArray[yIndex][xIndex];

        // Determines the game state based on the icon.
        if (gridSymbol === holeIcon) return {valid: false, message: 'You fell in a hole! Game Over!'};
        if (gridSymbol === hatIcon) return {valid: false, message: 'Congrats you found your hat!'};

        return {valid: true, message: ''}; 
    }

    // Executes the move action based on validation results.
    moveAction(validationResults, coordinates) {
        // If the move is invalid, updates the game state and prints the message.
        if (!validationResults.valid) {
            this._gameState = false;
            console.log(validationResults.message);
        } else {
            // If valid, updates the field with the player's new position.
            const [yIndex, xIndex] = coordinates;
            this._fieldArray[yIndex][xIndex] = playerIcon;
        }
    }

    // Main game loop.
    playGame() {
        while (this._gameState) {
            console.clear();
            this.print();
            const direction = this.getUserInput();
            const coordinates = this.movePlayer(direction);
            const validationResults = this.moveValidation(coordinates);
            this.moveAction(validationResults, coordinates); 
        }
    } 
}

// Example of generating and playing the game.
const testGame = new MazeGame([]);
testGame.generateMaze(10, 10, 15); // Generates a 10x10 maze with 15% holes.

// Uncomment to play the game with a predefined field.
/*
const game = new MazeGame([
    ['*', '░', '░', '░', 'O', 'O', 'O', '░', '░', 'O'],
    ['O', 'O', 'O', '░', 'O', '░', '░', '░', '░', 'O'],
    ['░', '░', '░', '░', '░', '░', 'O', 'O', '░', 'O'],
    ['░', 'O', 'O', 'O', 'O', '░', 'O', '░', '░', '░'],
    ['░', '░', '░', '░', '░', '░', 'O', '░', 'O', 'O'],
    ['O', 'O', 'O', 'O', '░', 'O', 'O', '░', 'O', '░'],
    ['░', '░', '░', '░', '░', '░', '░', '░', 'O', '░'],
    ['O', 'O', 'O', 'O', 'O', 'O', '░', 'O', 'O', '░'],
    ['O', '░', '░', '░', '░', '░', '░', '░', '░', '░'],
    ['O', '░', '░', '^', '░', '░', '░', 'O', 'O', 'O']
]);
game.playGame();
*/
