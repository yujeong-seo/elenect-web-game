import R from "./ramda.js";

const game_board = document.getElementById("game_board");

// initialise the board as 2D array
const initial_board = new Array(15).fill().map(() => new Array(10).fill(""));

function create_board () {
    for (let i = 0; i < initial_board.length; i++) {
        for (let j = 0; j < initial_board[i].length; j++) {
            const grid_element = document.createElement("div");
            grid_element.classList.add("grid");
            grid_element.id = `${i},${j}`;
            grid_element.addEventListener("click", add_token);
            game_board.append(grid_element);
        }
      }
}

function add_token(e) {
    console.log(e.target)
}

create_board();
