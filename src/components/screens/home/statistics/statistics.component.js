import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import { StatisticService } from '@/api/statistic.service'
import { Heading } from '@/components/ui/heading/heading.component'
import {
	LOADER_SELECTOR,
	Loader
} from '@/components/ui/loader/loader.component'
import { TRANSACTION_COMPLETED } from '@/constants/event.constants'
import { $R } from '@/core/rquery/rquery.lib'
import { Store } from '@/core/store/store'
import { formatToCurrency } from '@/utils/format/format-to-currency'
import { CircleChart } from './circle-chart/circle-chart.component'
import { StatisticItem } from './statistic-item/statistic-item.component'
import styles from './statistics.module.scss'
import template from './statistics.template.html'

export class Statistics extends ChildComponent {
	constructor() {
		super()

		this.store = Store.getInstance().state
		this.statisticService = new StatisticService()

		this.element = renderService.htmlToElement(
			template,
			[new Heading('Statistics')],
			styles
		)

		this.#addListeners()
	}

	#addListeners() {
		document.addEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	#removeListeners() {
		document.removeEventListener(
			TRANSACTION_COMPLETED,
			this.#onTransactionCompleted
		)
	}

	destroy() {
		this.#removeListeners()
	}

	#onTransactionCompleted = () => {
		this.fetchData()
	}

	renderChart(income, expense) {
		const total = income + expense
		let incomePercent = (income * 100) / total
		let expensePercent = 100 - incomePercent

		if (income && !expense) {
			incomePercent = 99.9
			expensePercent = 0.1
		}

		if (!income && expense) {
			incomePercent = 0.1
			expensePercent = 99.9
		}

		return new CircleChart(incomePercent, expensePercent).render()
	}

	fetchData() {
		this.statisticService.main(data => {
			if (!data) return

			const loaderElement = this.element.querySelector(LOADER_SELECTOR)
			if (loaderElement) loaderElement.remove()

			const statisticsItemsElement = $R(this.element).find('#statistics-items')
			statisticsItemsElement.text('')

			const circleChartElement = $R(this.element).find('#circle-chart')
			circleChartElement.text('')

			statisticsItemsElement
				.append(
					new StatisticItem(
						'Income:',
						formatToCurrency(data[0].value),
						'green'
					).render()
				)
				.append(
					new StatisticItem(
						'Expense:',
						formatToCurrency(data[1].value),
						'purple'
					).render()
				)

			circleChartElement.append(this.renderChart(data[0].value, data[1].value))
		})
	}
	render() {
		if (this.store.user) {
			$R(this.element).append(new Loader().render())
			setTimeout(() => this.fetchData(), 300)
		}
		return this.element
	}
}
