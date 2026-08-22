export function createRPSBlocks() {
    return [
        {
            type: "section" as const,
            text: {
                type: "mrkdwn" as const,
                text: "*Rock, Paper, Scissors!!*\n\n" + "Choose Your move!",
            },
        },
        {
            type: "actions" as const,
            elements: [
                {
                    type: "button" as const,
                    text: {
                        type: "plain_text" as const,
                        text: ":rock: Rock",
                    },
                    action_id: "rps_rock",
                    value: "rock",
                },
                {
                    type: "button" as const,
                    text: {
                        type: "plain_text" as const,
                        text: ":fc_paper: paper",
                    },
                    action_id: "rps_paper",
                    value: "paper",
                },
                {
                    type: "button" as const,
                    text: {
                        type: "plain_text" as const,
                        text: ":scissors: Scissors",
                    },
                    action_id: "rps_scissors",
                    value: "scissors",
                },
            ],
        },
    ];
}