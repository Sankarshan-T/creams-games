export type RPSChoice = "rock" | "paper" | "scissors";
export type RPSResult = "win" | "lose" | "draw";
export type RPSScore = {
    player: number;
    bot: number;
};

export function createScore(): RPSScore {
    return {
        player: 0,
        bot: 0,
    };
}

export function updateScore(
    score: RPSScore,
    result: RPSResult,
): void {
    if (result === "win") score.player++;
    else if (result === "lose") score.bot++;
}

export function isMatchOver(score: RPSScore): boolean {
    return score.player >= 3 || score.bot >= 3;
}

export function getBotChoice(): RPSChoice {
    const choices: RPSChoice[] = [
        "rock",
        "paper",
        "scissors",
    ];

    const randomIndex = Math.floor(
        Math.random() * choices.length,
    );

    return choices[randomIndex];
}

export function getResult(
    player: RPSChoice,
    bot: RPSChoice,
): RPSResult {
    if (player === bot) return "draw";

    if ((player === "rock" && bot === "scissors") ||
        (player === "paper" && bot === "rock") ||
        (player === "scissors" && bot === "paper")
    ) return "win";
    return "lose";
}