export type GameType =
    | "tictactoe"
    | "rps";

export interface ActiveGame {
    type: GameType;
    userId: string;
    state: unknown;
}