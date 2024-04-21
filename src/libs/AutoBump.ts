import {AutoBumpOptions} from "../types/AutoBumpOptions";
import {AutoBumpI} from "../types/AutoBump";
import {bumpData} from "@prisma/client";
import {Database} from "./Database";
import {BumpData} from "../types/BumpData";
import {DateTime} from "luxon";
import {Helper} from "./Helper";
import {SelfBot} from "./SelfBot";

export class AutoBump implements AutoBumpI {
    public readonly every: number;
    public readonly commandName: string;
    public readonly stealthSpan: number
    public readonly hours: number
    public nextTimestamp: number = 0;
    public static Instance: AutoBump
    private running: boolean = false;


    public constructor(options: AutoBumpOptions) {
        this.hours = options.hours
        this.every = options.every;
        this.stealthSpan = options.StealthSpan;
        this.commandName = options.commandName;
        AutoBump.Instance = this;
        console.log(`[INFO]: Initialized Variables`)
    }

    public setState(state: "running" | "not running"): boolean {
        state == "running" ? this.running = true : this.running = false
        return this.running
    }

    public async startTimer(data: bumpData): Promise<void> {
        setInterval(async () => {
            if (this.running) {
                const bumpData: BumpData = await Database.Instance.getCurrentData(data.eventId)
                const timeNow: number = DateTime.now().toMillis()
                const lastBumpData: number = bumpData.lastTimestamp.valueOf()
                if (timeNow >= lastBumpData) {
                    console.log(`[INFO]: Timer triggered.`)
                    if (this.stealthSpan !== 0) {
                        const lastTimestampUpd: Date = Helper.addHoursAndSecondsFromNow(this.hours, Math.floor(Math.random() * this.stealthSpan)).toJSDate()
                        this.nextTimestamp = lastTimestampUpd.valueOf()
                        await Database.Instance.setCurrentData({
                            eventId: bumpData.eventId,
                            lastTimestamp: lastTimestampUpd
                        }).then(r => {
                            SelfBot.Instance.sendSlashCommand(this.commandName).then(r => {
                                console.log(`[INFO]: Bumped!`)
                            }).catch(e => {
                                console.log(`[AutoBump]: Could not bump!`)
                            })
                        })
                    } else {
                        const lastTimestampUpd: Date = Helper.addHoursAndSecondsFromNow(this.hours, 0).toJSDate()
                        this.nextTimestamp = lastTimestampUpd.valueOf()
                        await Database.Instance.setCurrentData({
                            eventId: bumpData.eventId,
                            lastTimestamp: lastTimestampUpd
                        }).then(r => {
                            SelfBot.Instance.sendSlashCommand(this.commandName).then(r => {
                                console.log(`[INFO]: Bumped!`)
                            }).catch(e => {
                                console.log(`[AutoBump]: Could not bump!`)
                            })
                        })
                    }
                }
            }
        }, this.every)
    }

}