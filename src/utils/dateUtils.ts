import moment from 'moment-timezone';

/**
 * Gets a Date object adjusted to the specified time and timezone.
 *
 * @param {number} [hrs=0] - Hour of the day (24-hour format).
 * @param {number} [min=0] - Minute of the hour.
 * @param {number} [sec=0] - Second of the minute.
 * @param {number} [ms=0] - Millisecond of the second.
 * @param {string} [timezone='Europe/Madrid'] - Timezone string.
 * @param {boolean} [current=false] - If true, returns the current date and time in the specified timezone.
 * @returns {Date} - Adjusted Date object.
 */
export const getDate = (
  hrs: number = 0,
  min: number = 0,
  sec: number = 0,
  ms: number = 0,
  timezone: string = 'Europe/Madrid',
  current: boolean = false
): Date => {
  if (current) {
    return moment.tz(timezone).toDate();
  } else {
    const date = moment.tz(
      { hour: hrs, minute: min, second: sec, millisecond: ms },
      timezone
    );
    return date.toDate();
  }
};
