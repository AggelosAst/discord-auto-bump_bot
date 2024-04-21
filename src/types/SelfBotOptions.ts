export interface SelfBotOptions {
    /* Discord Token to log in to the account. */
    token: string,
    /* The UserId<Snowflake> of the discord bot to run the command for. */
    botId: string,
    /* The ChannelID<Snowflake> of the channel you want to send the bump command in. */
    channelId: string
}