import {PrismaClient} from "@prisma/client";
import {DatabaseI} from "../types/Database";
import {BumpData} from "../types/BumpData";
import * as crypto from "crypto";
import {Helper} from "./Helper";
import {AutoBump} from "./AutoBump";
import {DateTime} from "luxon";

export class Database implements DatabaseI {
    private readonly dbInstance: PrismaClient
    private connected: boolean = false
    public static Instance: Database

    public constructor() {
        this.dbInstance = new PrismaClient();
        Database.Instance = this;
    }

    public async startService(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.dbInstance.$connect()
                this.connected = true
                resolve()
            } catch (e) {
                throw Error(`[Database]: Could not connect: ${e}`)
            }
        })
    }

    public async setCurrentData(data: BumpData): Promise<BumpData> {
        return new Promise((resolve, reject) => {
            this.dbInstance.bumpData.update({
                data: {
                    eventId: data.eventId,
                    lastTimestamp: data.lastTimestamp
                },
                where: {
                    eventId: data.eventId
                }
            }).then(r => {
                resolve(r)
            })
        })
    }

    public async getCurrentData(eventId: string): Promise<BumpData> {
        return new Promise(async (resolve, reject) => {
            this.dbInstance.bumpData.findUnique({
                where: {
                    eventId: eventId
                }
            }).then(r => {
                if (r) {
                    resolve(r)
                } else {
                    throw Error("Unexpected error occured.. getCurrentData() returned null.")
                }
            })
        })
    }

    public async generateRecord(hours: number): Promise<BumpData> {
        return new Promise(async (resolve, reject) => {
            const PostponedTimestamp: DateTime = Helper.addHoursFromNow(hours)
            await this.dbInstance.bumpData.findFirst({
                where: {
                    eventId: {}
                }
            }).then(async r => {
                if (!r) {
                    await this.dbInstance.bumpData.create({
                        data: {
                            lastTimestamp:PostponedTimestamp.toString(),
                            eventId: crypto.randomUUID()
                        }
                    }).then((r: BumpData) => {
                        AutoBump.Instance.nextTimestamp = PostponedTimestamp.toMillis()
                        resolve(r)
                    })
                } else {
                    console.log(`[INFO]: Record already existing, wiping.`)
                    await this.dbInstance.bumpData.delete({
                        where: {
                            eventId: r.eventId
                        }
                    }).then(async r => {
                        console.log(`[INFO]: Removed already existing value. Adding.`)
                        await this.dbInstance.bumpData.create({
                            data: {
                                lastTimestamp: PostponedTimestamp.toString(),
                                eventId: crypto.randomUUID()
                            }
                        }).then((r: BumpData) => {
                            AutoBump.Instance.nextTimestamp = PostponedTimestamp.toMillis()
                            resolve(r)
                        })
                    })
                }
            })
        })
    }
}