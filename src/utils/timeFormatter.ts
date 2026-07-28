/**
 * Convertit des secondes en format adaptatif :
 * - 00:00:00 (si >= 1 heure)
 * - 00:00 (si >= 1 minute)
 * - 00 (si < 1 minute)
 */
export function formatSeconds(totalSeconds: number): string {
  if (totalSeconds < 0 || isNaN(totalSeconds)) return '00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else if (minutes > 0) {
    return `${pad(minutes)}:${pad(seconds)}`;
  } else {
    return pad(seconds);
  }
}

/**
 * Convertit une chaîne ("00:00:00", "00:00", ou "00") en secondes totales.
 */
export function parseTimeToSeconds(timeString: string): number {
  if (!timeString) return 0;

  const parts = timeString.split(':').map((part) => parseInt(part, 10) || 0);

  if (parts.length === 3) {
    // Format HH:MM:SS
    const [h, m, s]: [number, number, number] = parts as [number, number, number];
    return h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    // Format MM:SS
    const [m, s]: [number, number] = parts as [number, number];
    return m * 60 + s;
  } else if (parts.length === 1) {
    // Format SS
    const s : number = parts[0] as number;
    return s;
  }

  return 0;
}
