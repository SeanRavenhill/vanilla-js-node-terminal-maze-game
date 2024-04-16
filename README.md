# Maze Game - Node.js Terminal Edition

## Overview
Maze Game is a terminal-based navigation game implemented in Node.js. The player's objective is to move through a maze filled with holes to find their lost hat. The game requires strategic thinking as one wrong move could lead the player to fall into a hole, ending the game.

## Gameplay
- **Randomly Generated Mazes**: Each new game presents a unique maze with holes randomly distributed based on the specified density.
- **Player Position**: At the start, the player is placed at a random edge location of the maze.
- **Real-Time Feedback**: The maze updates with each move, showing the player's new position and the path traversed.

## How to Play
- Use the arrow keys (`u` for up, `d` for down, `l` for left, `r` for right) to move through the maze.
- Type `new` to generate a new maze with default settings.
- To create a custom-sized maze with a specific hole density, type `new` followed by three numbers representing the height, width, and hole percentage (e.g., `new 10 15 30`).
- Enter `exit` to quit the game.

## Getting Started
1. **Clone the repository**:  
   `git clone https://github.com/yourusername/maze-game-javascript-node.git`
2. **Navigate to the game directory**:  
   `cd maze-game-javascript-node`
3. **Install dependencies**:  
   `npm install`
4. **Start the game**:  
   `node main.js`

## Requirements
- Node.js installed on your machine.
- Terminal or command line interface.

## Support
If you encounter any problems or have suggestions, please open an issue in this repository.

## Contributions
Contributions are welcome! If you would like to contribute to this project, please create a pull request with your proposed changes.

## Author
- [Sean Ravenhill](https://github.com/SeanRavenhill) - Initial work and maintenance

Feel free to enjoy the game and share it with your friends!
