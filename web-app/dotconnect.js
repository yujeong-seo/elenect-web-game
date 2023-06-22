import R from "./ramda.js";

/**
 * 'dotconnect.js' is a module to model and play Dot Connect and related games. <br>
 * Dot Connect is a game where user connects dots to make the longest line as possible. <br>
 * In this web app, it is implemented as two player and grid-based connection game.
 * @namespace DotConnect
 * @author Yujeong Seo
 * @version 2022/23
 */
const DotConnect = Object.create(null);

/**
 * A Board is an 10x15 rectangular grid that tokens can be placed into
 * one at a time. <br>
 * Tokens can be placed in any empty positions by user selection.
 * @memberof DotConnect
 * @typedef {Array.<Array.<number>>} board
 */

/**
 * A turn indicates the current player's turn. <br>
 * Turn 0 indicates player A (fire), and
 * turn 1 indicates player B (water).
 * @memberof DotConnect
 * @typedef {(0|1)} turn
 */

/**
 * An array 'tokens' stores the type of tokens that
 * could be placed on the game board grid.
 * @memberof DotConnect
 * @typedef {Array}
 */
DotConnect.tokens = ["a_token", "b_token"];

/**
 * An object 'prev_positions' stores the grid positions of
 * the previous token. <br> The keys are the turn of the players
 * and corresponding values stores that player's previous token position.
 * @memberof DotConnect
 * @typedef {Object.<string, number[]>}
*/
DotConnect.prev_positions = {
    "0": [0, 0],
    "1": [0, 0]
};

/**
 * An object 'curr_positions' stores the grid positions of
 * the most current token. <br> The keys are the turn of the players
 * and corresponding values stores that player's current token position.
 * @memberof DotConnect
 * @typedef {Object.<string, number[]>}
*/
DotConnect.curr_positions = {
    "0": [0, 0],
    "1": [0, 0]
};

/**
 * Creates a new empty board with desired rows and columns. <br>
 * Can be specified with rows and columns input.
 * Unless there is specified value, returns a 10x15 board.
 * @memberof DotConnect
 * @function
 * @param {number} [row = 15] The row (height) of the new board.
 * @param {number} [column = 10] The column (width) of the new board.
 * @returns {DotConnect.board} An empty board for starting the game.
 */
DotConnect.initial_board = function (row = 15, col = 10) {
    return new Array(row).fill().map(
        () => new Array(col).fill("")
    );
};

/**
 * Changes the turn of the player and
 * return which player is next to play.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.turn} turn The current player.
 * @returns {(0|1)} The next player to play.
 */
DotConnect.swap_turn = function (turn) {
    turn = (
        turn === 0
        ? 1 // if it was "a" change to "b"
        : 0 // if token is not "a" change to "b"
    );
    return turn;
};

/**
 * As the token is placed onto the grid, it fills
 * the board with the corresponding string identifier ("a" or "b"). <br>
 * Helps identifying which cell is filled with which player's token or empty.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.board} board The board to add identifier.
 * @param {DotConnect.turn} turn The current player.
 * @returns {void} Adds identifier, returns nothing.
 */
DotConnect.fill_board = function (board, turn) {
    const row = DotConnect.curr_positions[turn][0];
    const col = DotConnect.curr_positions[turn][1];
    board[row][col] = (
        turn === 0
        ? "a"
        : "b"
    );
};

/**
 * Creates a random interrupting blocks on the board. <br>
 * Users can not make a move to the grid identified as a block.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.board} board The board to add the block.
 * @returns {void} Adds identifier, returns nothing. 
 */
DotConnect.add_random_block = function (board) {
    R.range(0,6).forEach(function (i) {
        let row = random_int(0,14);
        let col = random_int(0,9);
        board[row][col] = "x";
    });
};

const random_int = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns the array of positions that player
 * can place their next tokens. <br>
 * The positions are empty (no tokens placed)
 * and is adjacent to the most recent token that the player has placed.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.board} board The board to analyse.
 * @param {DotConnect.turn} turn The current player.
 * @returns {Array.<Array.<number>>} An array of positions on board grid.
 */
DotConnect.empty_adjacent = function (board, turn) {
    const row = DotConnect.curr_positions[turn][0];
    const col = DotConnect.curr_positions[turn][1];
    let output = [];

    if (row < 14) {
        output.push([row + 1, col]);
    }
    if (row > 0) {
        output.push([row - 1, col]);
    }
    if (col < 9) {
        output.push([row, col + 1]);
    }
    if (col > 0) {
        output.push([row, col - 1]);
    }

    output = output.filter((item) => board[item[0]][item[1]] === "");
    return output;
};

/**
 * Returns the numbers of total connected dots of both player.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.board} board The board to count.
 * @returns {Array.<number>} An array of number of connected dots.
 */
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

/**
 * If the game is ended, either returns the string of the
 * winner ("a" or "b") or "tie" after checking the conditions.
 * If not ended, returns undefined. <br>
 * Uses {@link DotConnect.empty_adjacent} and {@link DotConnect.connected_dots}
 * to check the status and if any more legal moves can be made.
 * @memberof DotConnect
 * @function
 * @param {DotConnect.board} board The board to analyse.
 * @returns {string|undefined} A result of the game.
 */
DotConnect.is_ended = function (board) {
    const a_blocked = no_legal_moves(board, 0);
    const b_blocked = no_legal_moves(board, 1);
    const no_winner = no_free_cells(board);
    const connects = DotConnect.connected_dots(board);
    let output;

    if (connects[0] === connects[1]) {
        if (a_blocked && b_blocked) {
            output = "tie";
        } else if (a_blocked && !b_blocked) {
            output = "b";
        } else if (!a_blocked && b_blocked) {
            output = "a";
        }
    } else if ((connects[0] > connects[1]) && b_blocked) {
        output = "a";
    } else if ((connects[0] < connects[1]) && a_blocked) {
        output = "b";
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