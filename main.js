// Required library for handling synchronous user input in the terminal environment.
const prompt = require('prompt-sync')({ sigint: true });

// Definitions of icons used within the game to represent different elements in the maze.
const hatIcon = '^';  // Represents the goal (hat) the player aims to reach.
const holeIcon = 'O';  // Represents obstacles (holes) that end the game if the player encounters them.
const fieldIcon = '░';  // Represents open fields that the player can move through.
const playerIcon = '*';  // Represents the player's current position in the maze.

// List of valid commands that the player can input to navigate through the maze.
const validInputs = ['u', 'd', 'l', 'r'];  // Correspond to up, down, left, and right movements.

// Text prompts and game instructions for the user on how to interact with the game in the terminal.
const gameStartMessage = `Maze Game is a simple terminal-based game where a 
player navigates a maze filled with hazards (holes) to find a hat. 
The player can move up, down, left, or right with the goal of reaching 
the hat without falling into any holes.`
const gameInstructions = `Instructions:
- Enter 'exit' to end the game and quit to the terminal.
- Enter 'new' to generate a new maze with default settings.
- Enter 'new <height> <width> <holesPercentage>' to create a custom maze with specified dimensions 
  and hole density. For example, 'new 10 10 25' generates a 10x10 maze with 25% holes.
- Use the following keys to move around the maze:
  'u' (up), 'd' (down), 'l' (left), 'r' (right)`;
const invalidInputMessage = 'Invalid input. Please try again.';
const askDirection = '\nWhich way? Enter command: ';

class MazeGame {
    constructor(height = 10, width = 10, holesPercentage = 20) {
        this._mazeArray = [];  // 2D array representing the game field.
        this._gameState = true;  // Boolean flag to control the ongoing state of the game.
        this._playerCoordinates = [0, 0];  // Initial position of the player on the game field.
        // Generate the initial maze with default or specified parameters
        this.generateMaze(height, width, holesPercentage);
    }

    // Method to generate a maze with random placements of holes, player, and the hat.
    generateMaze(height, width, holesPercentage) {
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
    
        // Safe to place the player
        mazeArray[playerIndexY][playerIndexX] = playerIcon;
    
        // Generate random coordinates for the hat, ensuring it's not placed on the player or a hole
        let hatIndexX, hatIndexY;
        do {
            hatIndexX = Math.floor(Math.random() * width);
            hatIndexY = Math.floor(Math.random() * height);
        } while ((hatIndexX === playerIndexX && hatIndexY === playerIndexY) || mazeArray[hatIndexY][hatIndexX] === holeIcon);
    
        // Safe to place the hat
        mazeArray[hatIndexY][hatIndexX] = hatIcon;
        this._mazeArray = mazeArray;  // Update 2D array representing the game field.
        this._playerCoordinates = [playerIndexY, playerIndexX];  // Update initial position of the player on the game field.
    }

    // Handles user input for navigation and special commands ('exit', 'new')
    // Exits game with 'exit', generates mazes with 'new', and accepts movement commands.
    getUserInput() {
        // Clears the console each time to refresh the game state display
        this.clearConsole();
        this.print();  // Print the current state before asking for input
    
        process.stdout.write(gameInstructions + '\n' + askDirection);
        
        while (true) {
            let direction = prompt('');  // Use an empty prompt to avoid automatic new lines
            if (validInputs.includes(direction)) return direction;  // Handle valid movement
            if (direction === 'exit') {
                this.handleExitCommand();
                return;  // Exit needs to end the input loop
            }
            if (direction.startsWith('new')) { 
                this.handleNewCommand(direction);
                this.print();  // Refresh the maze display after generating a new maze
                console.log(gameInstructions);
                process.stdout.write(askDirection);  // Continue on the same line
                continue;  // Continue to get input
            }
            process.stdout.write(invalidInputMessage + '\n' + askDirection);  // Prompt again on the same line
        }
    }

    // Exits the game.
    handleExitCommand() {
        console.log('Exiting the game...');
        process.exit();
    }

    // Generates a new maze based on input parameters.
    // Accepts 'new' for default settings or 'new <height> <width> <holesPercentage>' for custom settings.
    handleNewCommand(params) {
        const parts = params.split(' ');
        
        if (parts.length === 1) {
            // No additional parameters, generate default maze
            this.generateMaze(10, 10, 20); // Default size and hole percentage
        } else if (parts.length === 4) {
            // Custom dimensions and hole percentage provided
            const parsedHeight = parseInt(parts[1]);
            const parsedWidth = parseInt(parts[2]);
            const parsedHolesPercentage = parseInt(parts[3]);
    
            if (!isNaN(parsedHeight) && !isNaN(parsedWidth) && !isNaN(parsedHolesPercentage)) {
                this.generateMaze(parsedHeight, parsedWidth, parsedHolesPercentage);
            } else {
                console.log('Invalid parameters for "new" command. Please enter valid integers.');
                return; // Early return to avoid printing the maze if parameters are invalid
            }
        } 
        
        this.print(); // Print the newly generated maze
    }


    // Updates the player's position based on the input direction.
    movePlayer(direction) {
        let playerPosition = this._playerCoordinates;

        // Adjusts playerPosition based on the direction.
        switch (direction) {
            case 'r': playerPosition[1]++; break;
            case 'l': playerPosition[1]--; break;
            case 'u': playerPosition[0]--; break;
            case 'd': playerPosition[0]++; break;
        }

        return this._playerCoordinates;
    }

    // Validates the player's new position after a move attempt. 
    moveValidation(coordinates) {
        const [yIndex, xIndex] = coordinates;
        // Checks for out-of-bounds movement.
        if (yIndex < 0 || yIndex >= this._mazeArray.length || xIndex < 0 || xIndex >= this._mazeArray[0].length) {
            return {valid: false, message: 'Out of Bounds! Game Over!'};
        } 
        
        // Retrieves the icon at the new position.
        const gridSymbol = this._mazeArray[yIndex][xIndex];

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
            this._mazeArray[yIndex][xIndex] = playerIcon;
        }
    }

    // Clears the console using ANSI escape code '\x1Bc', effective in most ANSI-compatible terminals.
    // Note: adopted this approach as console.clear() may not be supported in some runtime environments.
    clearConsole() {
        process.stdout.write('\x1Bc'); // Send the reset and clear screen ANSI escape sequence to stdout.
    }

    // Method to print the current state of the maze with a border.
    print() {
        this.clearConsole();
        // Creates a border based on the width of the maze.
        const border = '-'.repeat(this._mazeArray[0].length + 2);
        // Prints the game introduction.
        console.log(gameStartMessage);
        // Maps each row of the field to a string and joins them with newline characters.
        console.log(`${border}\n${this._mazeArray.map(arr => `|${arr.join('')}|`).join('\n')}\n${border}`);
    }

    // Main game loop.
    playGame() {
        while (this._gameState) {
            this.print();
            const direction = this.getUserInput();
            const coordinates = this.movePlayer(direction);
            const validationResults = this.moveValidation(coordinates);
            this.moveAction(validationResults, coordinates); 
        }
    } 
}

// Example of generating and playing the game.
const testGame = new MazeGame();
testGame.playGame();
