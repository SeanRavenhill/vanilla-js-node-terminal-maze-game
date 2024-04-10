const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const validInputs = ['u', 'd', 'l', 'r'];

class Field {
    constructor(fieldArray) {
        this._fieldArray = fieldArray;
        this._gameState = true;
        this._initIndex = [0, 0];
    }

    get gameState() {
        return this._gameState;
    }

    print() {
        let arrString = '----------\n';
        this._fieldArray.forEach(arr => arrString += arr.join('') + '\n');
        arrString += '----------\n';
        console.log(arrString);
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

        if (gridSymbol === hole) {
            return {valid: false, message: 'You fell in a hole! Game Over!'};
        }

        if (gridSymbol === hat) {
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
            this._fieldArray[y_index][x_index] = pathCharacter;
            this.print
        }
    }
}

const myField = new Field([
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

const getUserInput = () => {
    let direction = '';

    while (!validInputs.includes(direction)) {
        console.log(`Use inputs of ('u' = up), ('d' = down), ('l' = left) or ('r' = right)`);
        direction = prompt('Which way? ');
        console.clear();
        if (!validInputs.includes(direction)) {
            myField.print();
            console.log(`Invalid input.`);
        } else {
            myField.print();
            return direction;
        }
    }
}

myField.print();
// While loop handles the game and gamestate.
while (myField.gameState) {
    const direction = getUserInput();
    const coordinates = myField.movePlayer(direction);
    const validationResults = myField.moveValidation(coordinates);
    myField.moveAction(validationResults, coordinates); 
}