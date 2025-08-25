import { Form } from './Form';
import { IOrderForm, IFormBase } from '../types';
import { AppDataModel } from './DataModel';

export class OrderForm extends Form {
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _orderForm: HTMLFormElement;
	protected _orderButtons: HTMLButtonElement;
	protected _dataModel: AppDataModel;

	constructor(container: HTMLFormElement, dataModel: AppDataModel) {
		super(container);

		this._dataModel = dataModel;
		this._orderForm = container.querySelector(
			'form[name="order"]'
		) as HTMLFormElement;
		this._cardButton = container.querySelector(
			'.button[name="card"]'
		) as HTMLButtonElement;
		this._cashButton = container.querySelector(
			'.button[name="cash"]'
		) as HTMLButtonElement;
		this._orderButtons = container.querySelector(
			'.order__buttons'
		) as HTMLButtonElement;
		const paymentField = document.createElement('input');

		paymentField.type = 'text';
		paymentField.name = 'payment';
		paymentField.hidden = true;
		this._orderButtons.appendChild(paymentField);

		this.initializeFields();
		this.bindPaymentEvents();
	}

	protected bindPaymentEvents() {
		this.container.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			if (target.closest('.button[name="card"]')) {
				this.selectPayment('card');
			} else if (target.closest('.button[name="cash"]')) {
				this.selectPayment('cash');
			}
		});

		this.container.addEventListener('submit', (event) => {
			const target = event.target as HTMLElement;
			if (target.closest('form[name="order"]')) {
				console.log('OrderForm submit event triggered via delegation');
				for (const [key] of this.fields) {
					this._dataModel.setOrderField(
						key as keyof IOrderForm,
						this.getFieldValue(key)
					);
				}

				this._dataModel.emit('orderForm:submit');
				event.preventDefault();
			}
		});
	}

	protected selectPayment(payment: string) {
		this.setFieldValue('payment', payment);

		if (this._cardButton) {
			this._cardButton.classList.toggle(
				'button_alt-active',
				payment === 'card'
			);
		}
		if (this._cashButton) {
			this._cashButton.classList.toggle(
				'button_alt-active',
				payment === 'cash'
			);
		}

		this.validateField('payment');
		this.updateSubmitButton();
	}

	protected validateField(name: string): boolean {
		const field = this.fields.get(name);

		if (!field) return false;

		const value = field.value.trim();
		let isValid = true;
		let errorMessage = '';

		if (name === 'payment') {
			if (!value) {
				isValid = false;
				errorMessage = 'Выберите способ оплаты';
			}
		} else if (name === 'address') {
			if (!value) {
				isValid = false;
				errorMessage = 'Поле обязательно для заполнения';
			} else if (value.length < 5) {
				isValid = false;
				errorMessage = 'Адрес должен содержать минимум 5 символов';
			}
		} else {
			isValid = value !== '';
			if (!isValid) errorMessage = 'Поле обязательно для заполнения';
		}

		if (!isValid) {
			this.showError(name, errorMessage);
		} else {
			this.hideError(name);
		}

		return isValid;
	}

	setFormData(data: Partial<IOrderForm>) {
		super.setFormData(data as Record<string, string>);

		if (data.payment) {
			this.selectPayment(data.payment);
		}
	}
}
