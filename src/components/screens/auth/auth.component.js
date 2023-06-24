import renderService from '@/core/services/render.service'

import { AuthService } from '@/api/auth.service'
import { Button } from '@/components/ui/button/button.component'
import { Field } from '@/components/ui/field/field.component'
import { BaseScreen } from '@/core/component/base-screen.component'
import { $R } from '@/core/rquery/rquery.lib'
import formService from '@/core/services/form.service'
import validationService from '@/core/services/validation.service'
import styles from './auth.module.scss'
import template from './auth.template.html'

export class Auth extends BaseScreen {
	#isTypeLogin = true

	constructor() {
		super({ title: 'Authorization' })
		this.authService = new AuthService()
	}

	#validateFields(formValues) {
		const emailLabel = $R(this.element).find('label:first-child')
		const passwordLabel = $R(this.element).find('label:last-child')

		if (!formValues.email) {
			validationService.showError(emailLabel)
		}

		if (!formValues.password) {
			validationService.showError(passwordLabel)
		}

		return formValues.email && formValues.password
	}

	#handleSubmit = e => {
		const formValues = formService.getFormValues(e.target)
		if (!this.#validateFields(formValues)) return

		const type = this.#isTypeLogin ? 'login' : 'register'
		this.authService.main(type, formValues)
	}

	#changeFormType = e => {
		e.preventDefault()

		$R(this.element)
			.find('h1')
			.text(this.#isTypeLogin ? 'Register' : 'Sign up')

		$R(e.target).text(this.#isTypeLogin ? 'Sign up' : 'Register')
		this.#isTypeLogin = !this.#isTypeLogin
	}

	render() {
		this.element = renderService.htmlToElement(
			template,
			[new Button({ children: 'Submit' })],
			styles
		)

		$R(this.element)
			.find('#auth-inputs')
			.append(
				new Field({
					placeholder: 'Enter email',
					name: 'email',
					type: 'email'
				}).render()
			)
			.append(
				new Field({
					placeholder: 'Enter password',
					name: 'password',
					type: 'password'
				}).render()
			)

		$R(this.element).find('#change-form-type').click(this.#changeFormType)

		$R(this.element).find('form').submit(this.#handleSubmit)

		return this.element
	}
}
