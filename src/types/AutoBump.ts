import {bumpData} from "@prisma/client";

export interface AutoBumpI {
    startTimer(data: bumpData): Promise<void>,
    setState(state: "running" | "not running"): boolean;
}