import DotConnect from "./game.js";

const result_text = [
    " ",
    " ",
    " "
];

const turn_text = [
    "Your turn!",
    "Waiting..."
];

const game_board = document.getElementById("game_board");
const a_turn = document.getElementById("a_turn");
const b_turn = document.getElementById("b_turn");

const board = DotConnect.initial_board;
const prev_positions = DotConnect.prev_positions;
const curr_positions = DotConnect.curr_positions;

let turn = 0;
let counter = 0;
let token;
let player = DotConnect.players[turn];

const create_board = function () {
    board.forEach(function (row, i) {
        row.forEach(function (_item, j) {
            const grid_element = document.createElement("div");
            grid_element.id = `${i}-${j}`;
            grid_element.classList.add("grid");
            game_board.append(grid_element);
            grid_element.addEventListener("click", play);
            a_turn.style.display = "block"; // start with a_turn
        });
    });
};

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
    // if game_end
};

const game_end = function (board) {
    const result = DotConnect.is_ended(board);
    if (result === "a") {
        // add
    } else if (result === "b") {
        // add
    } else if (result === "tie") {
        // add
    }
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

// Visual elements

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

const draw_line = function (start, end) {
    if (counter > 1) {
        const line_canvas = document.getElementById("line_canvas");
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
            if (startX < endX) {
                line.style.gridRowStart = startX + 1;
                line.style.gridRowEnd = endX + 2;
            } else {
                line.style.gridRowStart = endX + 1;
                line.style.gridRowEnd = startX + 2;
            }
            line.style.gridColumn = startY + 1;
        }

        line.style.background = (
            turn === 0
            ? "#C23B3B"
            : "#71DBEA"
        );

        line_canvas.append(line);
    }
};

create_board();