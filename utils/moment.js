import moment from "moment";

export function checkDateHourDiff(date) {
    const now = moment()
    const tokenSendAt = moment(date)
    const difference = moment.duration(now.diff(tokenSendAt))
    return difference.asHours()
}