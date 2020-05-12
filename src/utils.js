import { DateTime } from 'luxon'

export const nowUTC = () => {
  return DateTime.utc().toISO()
}

export const nowLocal = () => {
  return DateTime.local().toISO()
}

export const convertUTCtoLocal = (datetimeUTC) => {
  const datetime = DateTime.fromISO(datetimeUTC)
  return {
    date: datetime.toLocaleString(DateTime.DATE_HUGE),
    time: datetime.toLocaleString(DateTime.TIME_WITH_SECONDS)
  }
}
