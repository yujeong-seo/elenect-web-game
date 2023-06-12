import R from "./ramda.js";

const game_board = document.getElementById("game_board");
const a_turn = document.getElementById("a_turn");
const b_turn = document.getElementById("b_turn");
const initial_board = new Array(15).fill().map(() => new Array(10).fill(""));

let token = "a_token";
let counter = 0;


const create_board = function () {
    initial_board.forEach(function (row, i) {
        row.forEach(function (_item, j) {
            const grid_element = document.createElement("div");
            grid_element.id = `${i}-${j}`;
            grid_element.classList.add("grid");
            game_board.append(grid_element);
            grid_element.addEventListener("click", add_token);
            a_turn.style.display = "block"; // start with a_turn
        });
    });
};


const add_token = function (event) {
    const display_token = document.createElement("div");
    display_token.classList.add(token);
    event.target.append(display_token);

    const token_position = event.target.id;
    const indices = token_position.split("-");

    counter += 1;

    if (token === "a_token") {
        a_turn.style.display = "none"; // make it invisible
        b_turn.style.display = "block"; // make it visible
        initial_board[indices[0]][indices[1]] = "a";
    } else {
        a_turn.style.display = "block";
        b_turn.style.display = "none";
        initial_board[indices[0]][indices[1]] = "b";
    }

    // change the turn

    token = (
        token === "a_token"
        ? "b_token" // if token is a_token change to b_token
        : "a_token" // if token is not a_token change to a_token
    );

    event.target.removeEventListener("click", add_token);

    // first two tokens (a and b) can be placed anywhere but afterwards,
    // will allow tokens to only be placed on adjacent cell of the previous one
};

create_board();
