export interface AutoBumpOptions {
    /* Every {} minutes  */
    every: number,
    /* Command name for bumping */
    commandName: "bump",
    /* Per how many hours to run the command for */
    hours: number
    /* If not 0, sets the extra amount of time the bot will wait until bumping to prevent detection. In seconds (RANGE) */
    StealthSpan: number
}