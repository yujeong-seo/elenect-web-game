import DotConnect from "../dotconnect.js";

// Test for empty board

const throw_if_invalid_board = function (board) {
    // Check if the board is 2D array
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error("The board is not a 2D array.");
    }

    // Check if the board only contains empty strings
    board.forEach(function (row) {
        row.forEach(function (item) {
            if (item !== "") {
                throw new Error("The empty board contains token.");
            }
        });
    });
};

describe("Empty Board", function () {
    it("The empty board is valid.", function () {
        const initial_board = DotConnect.initial_board();
        throw_if_invalid_board(initial_board);
    });

    it("The empty board is not ended.", function () {
        const initial_board = DotConnect.initial_board();
        const game_result = DotConnect.is_ended(initial_board);
        if (game_result !== undefined) {
            throw new Error("The empty board should not end.");
        }
    });
});



// Test for playing the board

const throw_if_invalid_swap = function (turn) {
    const next_turn = DotConnect.swap_turn(turn);
    if (turn === next_turn) {
        throw new Error("The player does not swap properly.");
    }
};

const example_board = [
    ["", "a", "", "x", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "b", "x", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["x", "", "x", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "x", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", "", "x"],
    ["", "", "", "", "", "", "", "", "", ""]
];

describe("During Play", function () {
    it("The board is initialised with blocks.", function () {
        const board_with_block = DotConnect.initial_board();
        DotConnect.add_random_block(board_with_block);
        board_with_block.forEach(function (row) {
            row.forEach(function (item) {
                if ((item !== "") && (item !== "x")) {
                    throw new Error("The board contains invalid token.");
                }
            });
        });
    });

    it("The player turn swaps.", function () {
        throw_if_invalid_swap(0);
        throw_if_invalid_swap(1);
    });

    it("The board provides the position of adjacent grid cells.", function () {
        DotConnect.curr_positions[0] = [0, 1];
        DotConnect.curr_positions[1] = [2, 6];
        const a_expected = [[0, 0], [1, 1], [0, 2]];
        const b_expected = [[1, 6], [2, 5], [3, 6]];
        const a_adjacent = DotConnect.empty_adjacent(example_board, 0);
        const b_adjacent = DotConnect.empty_adjacent(example_board, 1);
        a_expected.sort();
        a_adjacent.sort();
        b_expected.sort();
        b_adjacent.sort();
        const a_valid = (
            JSON.stringify(a_expected) === JSON.stringify(a_adjacent)
        );
        const b_valid = (
            JSON.stringify(b_expected) === JSON.stringify(b_adjacent)
        );
        if (!a_valid || !b_valid) {
            throw new Error("The adjacent cells are invalid.");
        }
    });
});



// Test winning conditions for ended board

describe("Ended Board", function () {
    it("A board where only A can make move, A wins.", function () {
        const a_win_board = [
            ["", "", "", "", "", "", "", "a", "b", "b"],
            ["", "", "", "", "", "", "", "a", "b", "x"],
            ["", "", "", "", "a", "a", "a", "a", "b", ""],
            ["", "", "", "", "", "", "", "b", "b", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "x", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "x", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "x", "", "", "", "", "", "x", "", ""],
            ["", "", "", "", "x", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""]
        ];
        DotConnect.curr_positions[0] = [3, 4];
        DotConnect.curr_positions[1] = [0, 9];
        const result = DotConnect.is_ended(a_win_board);
        if (result !== "a") {
            throw new Error("A board should be won for player A (fire).");
        }
    });

    it("A board where only B can make move, B wins.", function () {
        const b_win_board = [
            ["", "", "", "", "", "", "", "b", "a", "a"],
            ["", "", "", "", "", "", "", "b", "a", "x"],
            ["", "", "", "b", "b", "b", "b", "a", "a", ""],
            ["", "", "", "b", "", "", "", "a", "a", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "x", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "x", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "x", "", "", "", "", "", "x", "", ""],
            ["", "", "", "", "x", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""]
        ];
        DotConnect.curr_positions[0] = [0, 9];
        DotConnect.curr_positions[1] = [3, 3];
        const result = DotConnect.is_ended(b_win_board);
        if (result !== "b") {
            throw new Error("A board should be won for player B (water).");
        }
    });

    it("A board with no free cells is tied.", function () {
        const tie_board_full = [
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "x", "b", "b", "x", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "x", "a", "b", "x", "b", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"],
            ["a", "a", "a", "a", "x", "b", "b", "x", "b", "b"],
            ["a", "a", "a", "a", "a", "b", "b", "b", "b", "b"]
        ];
        DotConnect.curr_positions[0] = [0, 0];
        DotConnect.curr_positions[1] = [14, 14];
        const result = DotConnect.is_ended(tie_board_full);
        if (result !== "tie") {
            throw new Error("A board should be tied.");
        }
    });

    it("A board where both can not mave legal move is tied.", function () {
        const tie_board_notfull = [
            ["a", "a", "", "", "", "", "", "", "", ""],
            ["a", "a", "", "", "", "", "", "", "", ""],
            ["a", "a", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "x", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "x", "", "x", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            ["", "x", "", "", "", "", "", "", "b", ""],
            ["", "", "x", "", "", "", "", "", "b", ""],
            ["", "", "", "", "", "", "", "", "b", ""],
            ["", "", "", "", "", "", "", "", "b", "x"],
            ["", "", "", "", "", "", "", "", "b", "b"]
        ];
        DotConnect.curr_positions[0] = [1, 0];
        DotConnect.curr_positions[1] = [14, 14];
        const result = DotConnect.is_ended(tie_board_notfull);
        if (result !== "tie") {
            throw new Error("A board should be tied.");
        }
    });
});