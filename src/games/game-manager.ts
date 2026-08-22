import type { ActiveGame, GameType } from "./types.js";

const games = new Map<string, ActiveGame>();

export function createGame(
    userId: string,
    type: GameType,
    state: unknown,
): ActiveGame {
    const game: ActiveGame = {
        type,
        userId,
        state,
    };
    games.set(userId, game);

    return game;
}

export function getGame(userId: string): ActiveGame | undefined {
    return games.get(userId);
}

export function deleteGame(userId: string): void {
    games.delete(userId);
}