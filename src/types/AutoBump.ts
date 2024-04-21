import {bumpData} from "@prisma/client";

export interface AutoBumpI {
    startTimer(data: bumpData): void,
}