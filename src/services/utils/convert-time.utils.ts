import * as dayjs from 'dayjs';

type Formats = 'HH:mm';

/**
 * Convert a dayjs time with a format to minutos.
 * Example:
 * time: dayjs()
 * format: "HH:mm"
 */
export function convertTimeToMinutes(
  date: dayjs.Dayjs,
  format: Formats,
): number {
  const timeObject = dayjs(date, format);

  if (!timeObject.isValid()) {
    throw new Error('Formato de tempo inválido');
  }

  const hours = timeObject.hour();
  const minutes = timeObject.minute();

  return hours * 60 + minutes;
}

export function convertMinutesToTimeString(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours == 24) hours = 0;

  // Formatar manualmente a string de horas e minutos
  const timeString = `${hours.toString().padStart(2, '0')}:${remainingMinutes
    .toString()
    .padStart(2, '0')}`;

  return timeString; // Devolver o tempo no formato HH:mm
}
