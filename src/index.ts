import {AutoBump} from "./libs/AutoBump";
import {Database} from "./libs/Database";
import {SelfBot} from "./libs/SelfBot";

const hours: number = 2;

async function Main(): Promise<void> {
    const AB = new AutoBump({
        commandName: "bump",
        every: 60000,
        hours: hours,
        StealthSpan: 25
    })
    const DB = new Database()
    DB.startService().then(_ => {
        console.log(`[INFO]: Started the service`)
        DB.generateRecord(hours).then(record => {
            const SB = new SelfBot({
                token: "token",
                botId: "discord bot id",
                channelId: "channel id"
            })
            SB.startService().then(_ => {
                AB.setState("running")
                AB.startTimer(record)
            })
        })
    })
}

Main()