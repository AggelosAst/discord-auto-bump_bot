import {BumpData} from "./BumpData";

export interface DatabaseI {
    startService(): Promise<void>;
    setCurrentData(data: BumpData): Promise<BumpData>;
    getCurrentData(eventId: string): Promise<BumpData>;
    generateRecord(hours: number): Promise<BumpData>;
}