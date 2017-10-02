
export class Settings {
    userId: Number;
    workDayTime = { hour: 0, minute: 0, allMinute: 0 };
    startTime = { hour: 0, minute: 0 };
    intervalTime = { hour: 0, minute: 0 };
    returnTime = { hour: 0, minute: 0 };
    endTime = { hour: 0, minute: 0 };

    workDayTimeString: String;
    startTimeString: String;
    intervalTimeString: String;
    returnTimeString: String;
    endTimeString: String;

    startAlarm: Boolean;
    intervalAlarm: Boolean;
    returnAlarm: Boolean;
    endAlarm: Boolean;

    alarmeAntecipatedIn: number;

    constructor() {

    }


}

