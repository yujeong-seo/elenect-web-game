/**
 * game.js is a module to model and play Dot Connect and related games.
 * @namespace DotConnect
 * @author Yujeong Seo
 * @version 2022/23
 */
const DotConnect = Object.create(null);

/**
 * A Board is an 10x15 grid that tokens can be placed into one at a time.
 * Tokens fill up empty positions -
 * @memberof DotConnect
 * @typedef {DotConnect.token_or_empty[][]} Board
 */

const total_row = 15; // height
const total_col = 10; // width

/* changing the player turn */

DotConnect.players = ["player_a", "player_b"];
DotConnect.tokens = ["a_token", "b_token"];
DotConnect.prev_positions = {
    "0": [0, 0],
    "1": [0, 0]
};
DotConnect.curr_positions = {
    "0": [0, 0],
    "1": [0, 0]
};


DotConnect.initial_board = new Array(total_row).fill().map(
    () => new Array(total_col).fill("")
);

DotConnect.swap_turn = function (index) {
    index = (
        index === 0
        ? 1 // if it was "a" change to "b"
        : 0 // if token is not "a" change to "b"
    );
    return index;
};

DotConnect.fill_board = function (board, turn) {
    const row = DotConnect.curr_positions[turn][0];
    const col = DotConnect.curr_positions[turn][1];
    board[row][col] = (
        turn === 0
        ? "a"
        : "b"
    );
};

DotConnect.empty_adjacent = function (board, turn) {
    const row = DotConnect.curr_positions[turn][0];
    const col = DotConnect.curr_positions[turn][1];
    let output = [];

    if (row < total_row) {
        output.push([row + 1, col]);
    }
    if (row > 0) {
        output.push([row - 1, col]);
    }
    if (col < total_col) {
        output.push([row, col + 1]);
    }
    if (col > 0) {
        output.push([row, col - 1]);
    }

    output = output.filter((item) => board[item[0]][item[1]] === "");
    return output;
};


DotConnect.connected_dots = function (board) {
    let a_count = 0;
    let b_count = 0;
    board.forEach(function (row) {
        row.forEach(function (item) {
            if (item === "a") {
                a_count += 1;
            } else if (item === "b") {
                b_count += 1;
            }
        });
    });
    return [a_count, b_count];
};

DotConnect.is_ended = function (board) {
    const a_blocked = no_legal_moves(board, 0);
    const b_blocked = no_legal_moves(board, 1);
    const no_winner = no_free_cells(board);
    const connects = DotConnect.connected_dots(board);
    let output;

    if ((connects[0] > connects[1]) && b_blocked) {
        output = "a";
    } else if ((connects[0] === connects[1]) && a_blocked) {
        output = (
            b_blocked
            ? "tie"
            : "b"
        );
    } else if (!no_winner) {
        output = "tie";
    } else {
        output = undefined;
    }
    return output;
};

const no_legal_moves = function (board, turn) {
    const adjacent = DotConnect.empty_adjacent(board, turn);
    if (adjacent.length === 0) {
        return true;
    }
    return false;
};

const no_free_cells = function (board) {
    let free_cells = false;
    board.forEach(function (row) {
        row.forEach(function (cell) {
            if (cell === "") {
                free_cells = true;
            }
        });
    });
    return free_cells;
};

export default Object.freeze(DotConnect);