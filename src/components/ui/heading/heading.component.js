import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import { $R } from '@/core/rquery/rquery.lib'
import styles from './heading.module.scss'
import template from './heading.template.html'

export class Heading extends ChildComponent {
	constructor(title = '') {
		super()
		this.title = title
	}
	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		$R(this.element).text(this.title)

		return this.element
	}
}
