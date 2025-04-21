import { format, toZonedTime } from 'date-fns-tz';

const DEFAULT_FORMAT = 'MMMM d, yyyy'; // or whatever you want

export function parseOffsetDateTime(
    dateString: string | null | undefined,
    formatStr: string = DEFAULT_FORMAT
): string | null {
    if (!dateString) return null;

    try {
        const date = new Date(dateString);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, formatStr, { timeZone });
    } catch (error) {
        console.error('Failed to parse date:', dateString, error);
        return null;
    }
}