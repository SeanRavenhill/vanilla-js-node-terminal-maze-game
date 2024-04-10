const prompt = require('prompt-sync')({ sigint: true });

const hatIcon = '^';
const holeIcon = 'O';
const fieldIcon = '░';
const playerIcon = '*';
const validInputs = ['u', 'd', 'l', 'r'];

class MazeGame {
    constructor(fieldArray) {
        this._fieldArray = fieldArray;
        this._gameState = true;
        this._initIndex = [0, 0];
    }

    print() {
        const border = '-'.repeat(this._fieldArray[0].length + 2); // +2 for padding or as needed
        console.log(`${border}\n${this._fieldArray.map(arr => `|${arr.join('')}|`).join('\n')}\n${border}`);
    }

    getUserInput() {
        const gameInstructions = `Use inputs of ('u' = up), ('d' = down), ('l' = left) or ('r' = right)`;
        const askDirection = 'Which way? ';
        const invalidInputMessage = 'Invalid input.';
        let direction = '';
    
        while (!validInputs.includes(direction)) {
            console.log(gameInstructions);
            direction = prompt(askDirection);
            if (!validInputs.includes(direction)) {
                console.log(invalidInputMessage);
            }
        }
        return direction;
    }

    movePlayer(direction) {
        let playerPosition = this._initIndex;

        switch (direction) {
            case 'r':
                playerPosition[1]++;
                break;
            case 'l':
                playerPosition[1]--;
                break;
            case 'u':
                playerPosition[0]--;
                break;
            case 'd':
                playerPosition[0]++;
                break;
        }

        return this._initIndex;       
    }

    moveValidation(coordinates) {
        const [yIndex, xIndex] = coordinates;
        const matrixGridX = this._fieldArray[0].length;
        const matrixGridY = this._fieldArray.length;

        if (yIndex < 0 || yIndex >= matrixGridY || xIndex < 0 || xIndex >= matrixGridX) {
            return {valid: false, message: 'Out of Bounds! Game Over!'}; 
        } 
        
        const gridSymbol = this._fieldArray[yIndex][xIndex];

        if (gridSymbol === holeIcon) {
            return {valid: false, message: 'You fell in a hole! Game Over!'};
        }

        if (gridSymbol === hatIcon) {
            return {valid: false, message: 'Congrats you found your hat!'};
        }

        return {valid: true ,message: ''}; 
    }

    moveAction(validationResults, coordinates) {
        if (!validationResults.valid) {
            this._gameState = false;
            console.log(validationResults.message);
        } else {
            const [yIndex, xIndex] = coordinates;
            this._fieldArray[yIndex][xIndex] = playerIcon;
        }
    }

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

    generateMaze(height, width, holesPercentage) {
        console.log(`Height: ${height} | Width: ${width} | Holes Percentage: ${holesPercentage}%`);
        
        let mazeArray = [];
        
        for (let i = 0; i < height; i++) {
            let row = [];
            for (let j = 0; j < width; j++) {
                // Determine if this cell should be a hole based on holesPercentage
                const isHole = Math.random() < holesPercentage / 100;
                row.push(isHole ? holeIcon : fieldIcon); // Use holeIcon or fieldIcon based on the isHole condition
            }
            mazeArray.push(row);
        }

        // Generate random coordinates for player icon
        const playerIndexX = Math.floor(Math.random() * width);
        const playerIndexY = Math.floor(Math.random() * height);

        mazeArray[playerIndexY][playerIndexX] = playerIcon;
        
        // Generate random coordinates for hat icon
        let hatIndexX, hatIndexY;
        do {
            hatIndexX = Math.floor(Math.random() * width);
            hatIndexY = Math.floor(Math.random() * width);
        } while (hatIndexX === playerIndexX && hatIndexY === playerIndexY);

        mazeArray[hatIndexY][hatIndexX] = hatIcon;

        // Adjust the border to match the updated logic
        const border = '-'.repeat(width + 2); // +2 for side borders
        console.log(`${border}\n${mazeArray.map(arr => `|${arr.join('')}|`).join('\n')}\n${border}`);
        console.log()
    }    
}

const testGame = new MazeGame([]);
testGame.generateMaze(10, 10, 15);

// working game state.
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