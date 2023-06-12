import R from "./ramda.js";

const game_board = document.getElementById("game_board");
const initial_board = new Array(15).fill().map(() => new Array(10).fill(""));

let token = "a_token";

function create_board () {
    initial_board.forEach (function(row, i) {
        row.forEach (function(_item, j) {
            const grid_element = document.createElement("div");
            grid_element.id = `${i}-${j}`;
            grid_element.classList.add("grid");
            game_board.append(grid_element);
            grid_element.addEventListener("click", add_token);
        });
    });
}

function add_token (e) {
    const display_token = document.createElement("div");
    display_token.classList.add(token);
    e.target.append(display_token);
    token = (
        token === "a_token"
        ? "b_token" // if token is a_token change to b_token
        : "a_token" // if token is not a_token change to a_token
    );
    e.target.removeEventListener("click", add_token);
}

create_board();
