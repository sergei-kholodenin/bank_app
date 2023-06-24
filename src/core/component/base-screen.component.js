import { getTitle } from '@/components/config/seo.config'

export class BaseScreen {
	/**
	 * Create a new BaseScreen instance.
	 * @param {Object} options - The options for the BaseScreen.
	 * @param {string} options.title - The title for the screen.
	 */
	constructor({ title }) {
		document.title = getTitle(title)
	}

	/**
	 * Render the screen component.
	 * @returns {HTMLElement}
	 */
	render() {
		throw new Error('Render method must be implemented in the child class')
	}
}
