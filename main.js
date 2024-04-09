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
    myField.movePlayer(direction);
}