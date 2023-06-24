import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import { CardService } from '@/api/card.service'
import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'
import {
	BALANCE_UPDATED,
	TRANSACTION_COMPLETED
} from '@/constants/event.constants'
import { $R } from '@/core/rquery/rquery.lib'
import { NotificationService } from '@/core/services/notification.service'
import validationService from '@/core/services/validation.service'
import { Store } from '@/core/store/store'
import styles from './transfer-field.module.scss'
import template from './transfer-field.template.html'

export const TRANSFER_FIELD_SELECTOR = '[name="card-number"]'

export class TransferField extends ChildComponent {
	constructor() {
		super()

		this.store = Store.getInstance().state
		this.cardService = new CardService()
		this.notificationService = new NotificationService()
	}

	handleTransfer = e => {
		e.preventDefault()

		if (!this.store.user) {
			this.notificationService.show('error', 'You need authorization!')
		}

		$R(e.target).text('Sending...').attr('disabled', true)

		const inputElement = $R(this.element).find('input')
		const toCardNumber = inputElement.value().replaceAll('-', '')

		const reset = () => {
			$R(e.target).removeAttr('disabled').text('Send')
		}

		if (!toCardNumber) {
			validationService.showError($R(this.element).find('label'))
			reset()
			return
		}

		let amount = prompt('Transfer amount:')

		this.cardService.transfer({ amount, toCardNumber }, () => {
			inputElement.value('')
			amount = ''

			document.dispatchEvent(new Event(TRANSACTION_COMPLETED))
			document.dispatchEvent(new Event(BALANCE_UPDATED))
		})

		reset()
	}

	render() {
		this.element = renderService.htmlToElement(
			template,
			[
				new Field({
					name: 'card-number',
					placeholder: 'XXXX-XXXX-XXXX-XXXX',
					variant: 'credit-card'
				}),
				new Button({
					children: 'Send',
					variant: 'purple',
					onClick: this.handleTransfer
				})
			],
			styles
		)
		return this.element
	}
}
