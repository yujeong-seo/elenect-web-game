import R from "./ramda.js";
import DotConnect from "./game.js";

const game_board = document.getElementById("game_board");
const a_turn = document.getElementById("a_turn");
const b_turn = document.getElementById("b_turn");
const board = DotConnect.initial_board;

let turn = 0;
let counter = 0;
let token;
let player;
// player = DotConnect.players[turn];
let a_curr_position;
let a_prev_position;
let b_curr_position;
let b_prev_position;

const create_board = function () {
    board.forEach(function (row, i) {
        row.forEach(function (_item, j) {
            const grid_element = document.createElement("div");
            grid_element.id = `${i}-${j}`;
            grid_element.classList.add("grid");
            game_board.append(grid_element);
            // when setting obstacles, add event listeners when item == ""
            grid_element.addEventListener("click", play);
            a_turn.style.display = "block"; // start with a_turn
        });
    });
};

const play = function (event) {
    if (counter >= 1) {
        enable_adjacent();
    }
    add_token(event);
    const selected_cell = event.target.id.split("-");
    if (turn === 0) {
        a_curr_position = selected_cell.map((item) => parseInt(item));
        a_turn.style.display = "none"; // make it invisible
        b_turn.style.display = "block"; // make it visible
        board[a_curr_position[0]][a_curr_position[1]] = "a";
        change_prev_tokens(a_prev_position);
        a_prev_position = a_curr_position;
    } else {
        b_curr_position = selected_cell.map((item) => parseInt(item));
        a_turn.style.display = "block";
        b_turn.style.display = "none";
        board[b_curr_position[0]][b_curr_position[1]] = "b";
        change_prev_tokens(b_prev_position);
        b_prev_position = b_curr_position;
    }
    turn = DotConnect.swap_turn(turn);
    counter += 1;
};

const add_token = function (event) {
    token = DotConnect.tokens[turn];
    const display_token = document.createElement("div");
    display_token.classList.add(token);
    event.target.append(display_token);
    event.target.removeEventListener("click", play);
};

const remove_all = function () {
    const all_elements = document.querySelectorAll(".grid");
    all_elements.forEach(function (element) {
        element.removeEventListener("click", play);
    });
    const prev_selectable = document.querySelectorAll(".selectable");
    prev_selectable.forEach(function (element) {
        element.classList.remove("selectable");
    });
};

const enable_adjacent = function () {
    let adjacent;
    remove_all();

    adjacent = (
        turn === 1
        ? DotConnect.adjacent_cell(a_curr_position)
        : DotConnect.adjacent_cell(b_curr_position)
    );

    adjacent.forEach(function (item) {
        const row = item[0];
        const col = item[1];
        if (board[row][col] === "") {
            const empty_adjacent = document.getElementById(row + "-" + col);
            empty_adjacent.addEventListener("click", play);
            const add_hover = empty_adjacent.classList.add("selectable");
            empty_adjacent.addEventListener("mouseenter", add_hover);
        }
    });
};

const change_prev_tokens = function (prev_position) {
    if (counter > 1) {
        const row = prev_position[0];
        const col = prev_position[1];
        const parent_div = document.getElementById(row + "-" + col);
        const prev_token = parent_div.getElementsByClassName(token)[0];
        prev_token.style.background = (
            turn === 0
            ? "#C23B3B"
            : "#71DBEA"
        );
    }
};

// problem: when adding a "div" element for the line,
// previous tokens move behind ...
// want to add line without affecting the position of tokens
const draw_line = function (before, end) {
    if (counter > 1) {
        const beforeX = before[0];
        const beforeY = before[1];
        const endX = end[0];
        const endY = end[1];
        const line = document.createElement("div");

        if (beforeX === endX) {
            line.classList.add("h_line");
            line.style.gridRow = beforeX + 1;
            line.style.gridColumnStart = beforeY + 1;
            line.style.gridColumnEnd = endY + 2;
        } else if (beforeY === endY) {
            line.classList.add("v_line");
            line.style.gridRowStart = beforeX + 1;
            line.style.gridRowEnd = endX + 2;
            line.style.gridColumn = beforeY + 1;
        }

        line.style.background = (
            turn === 0
            ? "#C23B3B"
            : "#71DBEA"
        );

        game_board.append(line);
    }
};

create_board();