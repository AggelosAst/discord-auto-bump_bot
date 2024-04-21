import {DateTime} from "luxon";

export class Helper {
    public static addHoursFromNow(hours: number): DateTime {
        return DateTime.now().plus({
            hour: hours
        })
    }
    public static addHoursAndSecondsFromNow(hours: number, seconds: number): DateTime {
        return DateTime.now().plus({
            hour: hours,
            second: seconds
        })
    }
}