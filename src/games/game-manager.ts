import type { Board } from "./tictactoe/game.js";

const games = new Map<string, Board>();

export function createGame(userId: string): Board {
    const board: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    games.set(userId, board);

    return board;
}

export function getGame(userId: string): Board | undefined {
    return games.get(userId);
}

export function deleteGame(userId: string): void {
    games.delete(userId);
}