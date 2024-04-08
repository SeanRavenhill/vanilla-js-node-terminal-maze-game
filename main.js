const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(fieldArray) {
        this._fieldArray = fieldArray;
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
let gameState = 'play';

myField.print();

while (gameState === 'play') {
    console.log('Use inputs of (u = up), (d = down), (l = left), (r = r)');
    const direction = prompt('Which way? ');
    console.clear();
    myField.print();
}


