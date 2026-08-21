import type { Board } from "./game.js";

export function createBoardBlocks(board: Board) {
    return board.map((row, rowIndex) => ({
        type: "actions" as const,
        elements: row.map((cell, colIndex) => ({
            type: "button" as const,
            text: {
                type: "plain_text" as const,
                text: cell ?? " ",
            },
            action_id: `ttt_${rowIndex}_${colIndex}`,
            value: `${rowIndex},${colIndex}`,
        })),
    }));
}