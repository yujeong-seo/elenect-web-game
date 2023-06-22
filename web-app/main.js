import DotConnect from "./dotconnect.js";

const result_text = [
    "Fire's unstoppable fury caused the evaporation of water.",
    "The power of water successfully extinguished the fire.",
    "The clash of elements reached an equilibrium."
];

const result_winner = [
    "Fire wins !",
    "Water wins !",
    "Game is tied."
];

const turn_text = [
    "Your turn !",
    "Waiting..."
];

const game_board = document.getElementById("game_board");
const a_turn = document.getElementById("a_turn");
const b_turn = document.getElementById("b_turn");
const result_dialog = document.getElementById("result_dialog");
const line_canvas = document.getElementById("line_canvas");

let board = DotConnect.initial_board();
let prev_positions = DotConnect.prev_positions;
let curr_positions = DotConnect.curr_positions;

let turn = 0;
let total_play = 0;
let counter = 0;
let token;


// initialise the first game board
const create_board = function () {
    DotConnect.add_random_block(board);
    board.forEach(function (row, i) {
        row.forEach(function (_item, j) {
            const grid_element = document.createElement("div");
            grid_element.id = `${i}-${j}`;
            grid_element.classList.add("grid");
            game_board.append(grid_element);
            if (board[i][j] === "x") {
                grid_element.classList.add("block");
            } else {
                grid_element.addEventListener("click", play);
            }
        });
    });
    a_turn.style.display = "block"; // initially start with a
};


// redraw the board after the first play
const redraw_board = function () {
    DotConnect.add_random_block(board);
    const grid_elements = document.querySelectorAll(".grid");
    grid_elements.forEach(function (element) {
        const grid_id_str = element.id.split("-");
        const grid_id = grid_id_str.map((item) => parseInt(item));
        if (board[grid_id[0]][grid_id[1]] === "x") {
            element.classList.add("block");
        } else {
            element.addEventListener("click", play);
        }
    });

    // depending of the count of the play, the game order changes
    if (total_play % 2 === 0) {
        turn = 0; // start with a
        a_turn.style.display = "block";
        document.getElementById("a_ready").textContent = "You go first !";
        document.getElementById("b_ready").textContent = turn_text[1];
    } else {
        turn = 1; // start with b
        b_turn.style.display = "block";
        document.getElementById("a_ready").textContent = turn_text[1];
        document.getElementById("b_ready").textContent = "You go first !";
    }
};


// function added to each grid as an event listener
// at each turn
const play = function (event) {
    add_token(event);

    const selected_cell = event.target.id.split("-");
    curr_positions[turn] = selected_cell.map((item) => parseInt(item));
    const curr_position = curr_positions[turn];
    const prev_position = prev_positions[turn];

    DotConnect.fill_board(board, turn);

    if (turn === 0) {
        a_turn.style.display = "none"; // make it invisible
        b_turn.style.display = "block"; // make it visible
    } else {
        a_turn.style.display = "block";
        b_turn.style.display = "none";
    }

    document.getElementById("a_ready").textContent = turn_text[1 - turn];
    document.getElementById("b_ready").textContent = turn_text[turn];

    change_prev_tokens();
    draw_line(prev_position, curr_position);

    prev_positions[turn] = curr_positions[turn];
    turn = DotConnect.swap_turn(turn);
    counter += 1;
    if (counter >= 2) {
        enable_adjacent();
    }
    check_game_end(board);
};

// add token element to the grid
const add_token = function (event) {
    token = DotConnect.tokens[turn];
    const display_token = document.createElement("div");
    display_token.classList.add(token);
    event.target.append(display_token);
    event.target.removeEventListener("click", play);
};

// remove all the event listeners before the next turn
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

// add event listner only to empty adjacent cells
const enable_adjacent = function () {
    remove_all();
    const adjacent = DotConnect.empty_adjacent(board, turn);
    adjacent.forEach(function (item) {
        const row = item[0];
        const col = item[1];
        const adjacent_element = document.getElementById(row + "-" + col);
        adjacent_element.addEventListener("click", play);
        const add_hover = adjacent_element.classList.add("selectable");
        adjacent_element.addEventListener("mouseenter", add_hover);
    });
};

// clear all the divs before the new game starts
const clear_elements = function () {
    const line_element = line_canvas.querySelectorAll(".h_line, .v_line");
    line_element.forEach(function (element) {
        element.remove();
    });

    const token_element = document.querySelectorAll(".a_token, .b_token");
    token_element.forEach(function (element) {
        element.remove();
    });

    const block_element = document.querySelectorAll(".block");
    block_element.forEach(function (element) {
        element.classList.remove("block");
    });
};

// check if the game is ended
// display result dialog
const check_game_end = function (board) {
    let index;
    let ended = true;
    const result = DotConnect.is_ended(board);
    if (result === "a") {
        index = 0;
    } else if (result === "b") {
        index = 1;
    } else if (result === "tie") {
        index = 2;
    } else {
        ended = false;
    }

    if (ended) {
        document.getElementById("result_message").textContent = (
            result_text[index]
        );
        document.getElementById("result_winner").textContent = (
            result_winner[index]
        );
        document.getElementById("a_ready").textContent = "Game ended";
        document.getElementById("b_ready").textContent = "Game ended";
        a_turn.style.display = "none";
        b_turn.style.display = "none";
        result_dialog.showModal();
    }
    update_stat();
};

// update the game statistics
const update_stat = function () {
    const game_stat = DotConnect.game_stat(board);

    document.getElementById("a_win").textContent = game_stat[0];
    document.getElementById("a_tie").textContent = game_stat[1];
    document.getElementById("a_lose").textContent = game_stat[2];

    document.getElementById("b_win").textContent = game_stat[2];
    document.getElementById("b_tie").textContent = game_stat[1];
    document.getElementById("b_lose").textContent = game_stat[0];
};

// VISUAL ELEMENTS
// change the appearance of previous tokens
const change_prev_tokens = function () {
    if (counter > 1) {
        const row = prev_positions[turn][0];
        const col = prev_positions[turn][1];
        const parent_div = document.getElementById(row + "-" + col);
        const prev_token = parent_div.getElementsByClassName(token)[0];
        prev_token.style.background = (
            turn === 0
            ? "#C23B3B"
            : "#71DBEA"
        );
    }
};

// draw a line between the tokens
const draw_line = function (start, end) {
    if (counter > 1) {
        const startX = start[0];
        const startY = start[1];
        const endX = end[0];
        const endY = end[1];
        const line = document.createElement("div");

        if (startX === endX) {
            line.classList.add("h_line");
            line.style.gridRow = startX + 1;
            if (startY < endY) {
                line.style.gridColumnStart = startY + 1;
                line.style.gridColumnEnd = endY + 2;
            } else {
                line.style.gridColumnStart = endY + 1;
                line.style.gridColumnEnd = startY + 2;
            }
        } else if (startY === endY) {
            line.classList.add("v_line");
            line.style.gridColumn = startY + 1;
            if (startX < endX) {
                line.style.gridRowStart = startX + 1;
                line.style.gridRowEnd = endX + 2;
            } else {
                line.style.gridRowStart = endX + 1;
                line.style.gridRowEnd = startX + 2;
            }
        }

        line.style.background = (
            turn === 0
            ? "#C23B3B"
            : "#71DBEA"
        );

        line_canvas.append(line);
    }
};


// 'how to play' button
const open_howto_btn = document.getElementById("open_howto");
const close_howto_btn = document.getElementById("close_howto");
const howto_dialog = document.getElementById("howto");

open_howto_btn.onclick = function () {
    howto_dialog.showModal();
};

close_howto_btn.onclick = function () {
    howto_dialog.close();
};

howto_dialog.onclick = close_howto_btn.onclick;


// RUN GAME
// initial set up
create_board();

// restart after the first play
result_dialog.onclick = function () {
    total_play += 1;
    board = DotConnect.initial_board();
    prev_positions = DotConnect.prev_positions;
    curr_positions = DotConnect.curr_positions;
    counter = 0;
    clear_elements();
    redraw_board();
    result_dialog.close();
};

result_dialog.onkeydown = result_dialog.onclick;