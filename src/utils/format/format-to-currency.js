/**
 * Formats a number as a string with the specified currency symbol.
 * @param {number} number - The number to be converted into currency format.
 * @returns {string} The formatted number to the currency format.
 */
export function formatToCurrency(number) {
	return new Intl.NumberFormat('ru-Ru', {
		currency: 'RUB',
		style: 'currency'
	}).format(number)
}
