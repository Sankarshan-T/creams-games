export type RPSChoice = "rock" | "paper" | "scissors";
export type RPSResult = "win" | "lose" | "draw";

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