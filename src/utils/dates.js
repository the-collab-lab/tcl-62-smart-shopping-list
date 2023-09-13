const ONE_DAY_IN_MILLISECONDS = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * getFutureDate(3)
 * @param {number} offset
 */
export function getFutureDate(offset) {
	return new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);
}

export function getDaysBetweenDates(olderDate, newerDate) {
	const olderDateMs = olderDate.getTime();
	const newerDateMs = newerDate.getTime();
	const differenceInMs = newerDateMs - olderDateMs;
	const differenceInDays = differenceInMs / ONE_DAY_IN_MILLISECONDS;
	return differenceInDays;
}
