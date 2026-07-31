/**
 * Converts seconds into an adaptive format:
 * - 00:00:00 (if >= 1 hour)
 * - 00:00 (if >= 1 minute)
 * - 00 (if < 1 minute)
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
 * Converts a string ("00:00:00", "00:00", or "00") to total seconds.
 */
export function parseTimeToSeconds(timeString: string): number {
  if (!timeString) return 0;

  const parts = timeString.split(':').map((part) => parseInt(part, 10) || 0);

  if (parts.length === 3) {
    // HH:MM:SS format
    const [h, m, s]: [number, number, number] = parts as [number, number, number];
    return h * 3600 + m * 60 + s;
  } else if (parts.length === 2) {
    // MM:SS format
    const [m, s]: [number, number] = parts as [number, number];
    return m * 60 + s;
  } else if (parts.length === 1) {
    // SS format
    const s : number = parts[0] as number;
    return s;
  }

  return 0;
}
