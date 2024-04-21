
export interface SelfBotI {
    startService(): Promise<void>;
    sendSlashCommand(commandName: string) : Promise<boolean>;
}