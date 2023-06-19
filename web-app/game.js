import R from "./ramda.js";

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

const total_row = 15;
const total_col = 10;

/* changing the player turn */

DotConnect.players = ["player_a", "player_b"];
DotConnect.tokens = ["a_token", "b_token"];

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

DotConnect.adjacent_cell = function (position) {
    let row = position[0];
    let col = position[1];
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
    return output;
};

let a_count = 0;
let b_count = 0;

DotConnect.connected_dots = function () {
    DotConnect.initial_board.forEach(function (row) {
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

// after a makes a go, evaluate b's position if it can make additional go
DotConnect.winning_condition = function (position) {
    
};


/* Also can use ...
DotConnect.empty_board = function (row = 10, col = 15) {
    return R.repeat(R.repeat("", row), col);
};
*/

export default Object.freeze(DotConnect);