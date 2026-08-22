export type Cell = "X" | "O" | null;

export type Board = [
    [Cell, Cell, Cell],
    [Cell, Cell, Cell],
    [Cell, Cell, Cell]
];

export function createBoard(): Board {
    return [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
}

export function makeMove(
    board: Board,
    row: number,
    col: number,
    player: "X" | "O"
): boolean {
    if (board[row][col] !== null) {
        return false;
    }

    board[row][col] = player;

    return true;
}

export function makeBotMove(board: Board): boolean {
    const winningMove = findWinningMove(board, "O");

    if (winningMove) {
        const [row, col] = winningMove;
        board[row][col] = "O";
        return true;
    }

    const blockingMove = findWinningMove(board, "X");

    if (blockingMove) {
        const [row, col] = blockingMove;
        board[row][col] = "O";
        return true;
    }

    const emptyCells: [number, number][] = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === null) {
                emptyCells.push([row, col]);
            }
        }
    }

    if (emptyCells.length === 0) {
        return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    board[row][col] = "O";

    return true;
}

export function checkWinner(board: Board): Cell {
    for (let row = 0; row < 3; row++) {
        if (
            board[row][0] !== null &&
            board[row][0] === board[row][1] &&
            board[row][1] === board[row][2]
        ) return board[row][0];
    }

    for (let col = 0; col < 3; col++) {
        if (
            board[0][col] !== null &&
            board[0][col] === board[1][col] &&
            board[1][col] === board[2][col]
        ) return board[0][col];
    }

    if (
        board[0][0] !== null &&
        board[0][0] === board[1][1] &&
        board[1][1] === board[2][2]
    ) return board[0][0];

    if (
        board[0][2] !== null &&
        board[0][2] === board[1][1] &&
        board[1][1] === board[2][0]
    ) return board[0][2];

    return null;
}

export function isBoardFull(board: Board): boolean {
    for (const row of board) {
        for (const cell of row) {
            if (cell === null) {
                return false;
            }
        }
    }
    return true;
}

export function findWinningMove(board: Board, player: "X" | "O"): [number, number] | null {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] !== null) continue;
            board[row][col] = player;
            const winner = checkWinner(board);
            board[row][col] = null;
            if (winner === player) return [row, col];
        }
    }
    return null;
}

function minmax(board: Board, maximizing: boolean): number {
    const winner = checkWinner(board);
    if (winner === "O") return 10;
    if (winner === "X") return -10;
    if (isBoardFull(board)) return 0;

    if (maximizing) {
        let bestScore = -Infinity;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] !== null) continue;

                board[row][col] = "O";
                const score = minmax(board, false);
                board[row][col] = null;
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    }

    let bestScore = Infinity;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] !== null) {
                continue;
            }

            board[row][col] = "X";

            const score = minmax(board, true);

            board[row][col] = null;

            bestScore = Math.min(bestScore, score);
        }
    }

    return bestScore;
}

export function makeBestBotMove(board: Board) {
    let bestScore = -Infinity;
    let bestMove: [number, number] | null = null;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] !== null) continue;


            board[row][col] = "O";

            const score = minmax(board, false);

            board[row][col] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = [row, col];
            }
        }
    }

    if (!bestMove) return false;
    const [row, col] = bestMove;
    board[row][col] = "O";
    return true;
}