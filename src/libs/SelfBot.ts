import {Client, Message, TextChannel} from "discord.js-selfbot-v13";
import {SelfBotOptions} from "../types/SelfBotOptions";
import {AutoBump} from "./AutoBump";
import {DateTime, DurationObjectUnits} from "luxon";
import {SelfBotI} from "../types/SelfBot";

export class SelfBot implements SelfBotI{
    private readonly token: string
    private readonly Client: Client
    private readonly botId: string
    private readonly channelId: string
    public static Instance: SelfBot

    public constructor(options: SelfBotOptions) {
        this.token = options.token;
        this.botId = options.botId
        this.channelId = options.channelId
        this.Client = new Client<boolean>({
            retryLimit: 2
        })
        SelfBot.Instance = this;
    }

    private async messageCreate(): Promise<void> {
        this.Client.on("messageCreate", async (msg: Message) => {
            const content: string = msg.content
            const authorId: string = msg.author.id
            if (content == "/checkbumps" && authorId == this.Client!.user!.id) {
                const BumpData: DurationObjectUnits = DateTime.fromMillis(AutoBump.Instance.nextTimestamp).diffNow(["hours", "minutes", "seconds"]).toObject()
                if (BumpData.seconds) {
                    BumpData.seconds = parseInt(BumpData.seconds.toFixed(0))
                }
                await msg.delete()
                msg.channel.send({
                    content: `\`\`\`\nSelfBot Settings:\n  Token: Nope,\n  Bot ID: ${this.botId},\n  Channel ID: ${this.channelId}\n\n\nAutoBump Settings:\n  Command Name: ${AutoBump.Instance.commandName},\n  Every: ${AutoBump.Instance.every},\n  Hours: ${AutoBump.Instance.hours},\n  StealthSpan: ${AutoBump.Instance.stealthSpan}\n\nThe next bumping will happen at: In ${BumpData.hours}h ${BumpData.minutes}m ${BumpData.seconds}s ${AutoBump.Instance.stealthSpan != 0 ? "(STEALTH MODE ON)" : ""}\`\`\``
                })
            }
        })
    }

    public async startService(): Promise<void> { /* Aka, login. */
        return new Promise(async (resolve, reject) => {
            try {
                await this.messageCreate()
                await this.Client.login(this.token)
                resolve()
            } catch (e) {
                throw Error(`[DiscordBot]: Could not start service due to ${e}`)
            }
        })
    }

    public async sendSlashCommand(commandName: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const Channel: TextChannel = await this.Client.channels.fetch(this.channelId) as TextChannel
            if (Channel) {
                await Channel.sendSlash(this.botId, commandName).then(r => {
                    resolve(true)
                }).catch(e => {
                    reject(false)
                })
            }
        })
    }
}