import { format, toZonedTime } from "date-fns-tz"
import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

export const DEFAULT_FORMAT = "MMMM d, yyyy"

export function parseOffsetDateTimeToString(
  dateString: string | null | undefined,
  formatStr: string = DEFAULT_FORMAT,
): string | null {
  if (!dateString) return null

  try {
    const date = new Date(dateString)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const zonedDate = toZonedTime(date, timeZone)
    return format(zonedDate, formatStr, { timeZone })
  } catch (error) {
    console.error("Failed to parse date:", dateString, error)
    return null
  }
}

dayjs.extend(utc)
dayjs.extend(timezone)

export function parseOffsetDateTime(
  dateInput: string | Date | null | undefined,
): Dayjs | null {
  if (!dateInput) return null
    return dayjs(dateInput as any)
    .utc()
    .tz(dayjs.tz.guess())
}