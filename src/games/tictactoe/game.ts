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