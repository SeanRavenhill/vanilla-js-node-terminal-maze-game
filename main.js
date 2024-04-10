const prompt = require('prompt-sync')({ sigint: true });

const hatIcon = '^';
const holeIcon = 'O';
const fieldIcon = '░';
const playerIcon = '*';
const validInputs = ['u', 'd', 'l', 'r'];

class mazeGame {
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
        const [y_index, x_index] = coordinates;
        const matrixGridX = this._fieldArray[0].length;
        const matrixGridY = this._fieldArray.length;

        if (y_index < 0 || y_index >= matrixGridY || x_index < 0 || x_index >= matrixGridX) {
            return {valid: false, message: 'Out of Bounds! Game Over!'}; 
        } 
        
        const gridSymbol = this._fieldArray[y_index][x_index];

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
            const [y_index, x_index] = coordinates;
            this._fieldArray[y_index][x_index] = playerIcon;
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
}

const game = new mazeGame([
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