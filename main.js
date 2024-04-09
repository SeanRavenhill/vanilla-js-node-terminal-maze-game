const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(fieldArray, gameState = true) {
        this._fieldArray = fieldArray;
        this._gameState = gameState;
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
    const validInputs = ['u', 'd', 'l', 'r'];
    
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

const userInput = direction => {
    console.log(direction);
}

myField.print();

while (myField.gameState) {
    const input = getUserInput();
    userInput(input);
}