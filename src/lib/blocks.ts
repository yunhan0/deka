export const BLOCKS_PER_YEAR = 36;
export const BLOCKS_PER_MONTH = 3;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Get the month (1-12) and position (0, 1, 2) within the month for a block.
 */
function blockToMonthPosition(blockNumber: number): {
  month: number;
  position: number;
} {
  const month = Math.ceil(blockNumber / BLOCKS_PER_MONTH);
  const position = (blockNumber - 1) % BLOCKS_PER_MONTH;
  return { month, position };
}

/**
 * Get the start and end dates for a given block number and year.
 * Position 0: day 1-10
 * Position 1: day 11-20
 * Position 2: day 21-end of month
 */
export function getBlockDates(
  year: number,
  blockNumber: number
): { start: Date; end: Date } {
  const { month, position } = blockToMonthPosition(blockNumber);

  let startDay: number;
  let endDay: number;

  if (position === 0) {
    startDay = 1;
    endDay = 10;
  } else if (position === 1) {
    startDay = 11;
    endDay = 20;
  } else {
    startDay = 21;
    endDay = daysInMonth(month, year);
  }

  return {
    start: new Date(year, month - 1, startDay),
    end: new Date(year, month - 1, endDay),
  };
}

/**
 * Get the block number (1-36) for a given date.
 */
export function getCurrentBlock(date: Date = new Date()): {
  year: number;
  blockNumber: number;
} {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  let position: number;
  if (day <= 10) {
    position = 0;
  } else if (day <= 20) {
    position = 1;
  } else {
    position = 2;
  }

  const blockNumber = (month - 1) * BLOCKS_PER_MONTH + position + 1;
  return { year, blockNumber };
}

/**
 * Get a short label like "Jan 1 - 10" or "Feb 21 - 28".
 */
export function getBlockLabel(blockNumber: number, year: number): string {
  const { start, end } = getBlockDates(year, blockNumber);
  const monthShort = MONTH_SHORT[start.getMonth()];
  return `${monthShort} ${start.getDate()} - ${end.getDate()}`;
}

/**
 * Get the full month name for a block number.
 */
export function getBlockMonth(blockNumber: number): string {
  const { month } = blockToMonthPosition(blockNumber);
  return MONTH_NAMES[month - 1];
}

/**
 * Get the short month name for a block number.
 */
export function getBlockMonthShort(blockNumber: number): string {
  const { month } = blockToMonthPosition(blockNumber);
  return MONTH_SHORT[month - 1];
}

/**
 * Check if a block is in the past, current, or future.
 */
export function getBlockStatus(
  blockNumber: number,
  year: number
): "past" | "current" | "future" {
  const current = getCurrentBlock();

  if (year < current.year) return "past";
  if (year > current.year) return "future";

  if (blockNumber < current.blockNumber) return "past";
  if (blockNumber > current.blockNumber) return "future";
  return "current";
}
