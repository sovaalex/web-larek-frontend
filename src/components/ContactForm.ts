import { Form } from './Form';
import { AppDataModel } from './DataModel';
import { IContactsForm } from '../types';

export class ContactForm extends Form {
	protected _contactForm: HTMLFormElement;
	protected _dataModel: AppDataModel;

	constructor(container: HTMLFormElement, dataModel: AppDataModel) {
		super(container);

		this._dataModel = dataModel;

		this._contactForm = container.querySelector(
			'form[name="contacts"]'
		) as HTMLFormElement;

		this.initializeFields();
		this.bindPaymentEvents();
	}

	protected bindPaymentEvents() {
		if (this._contactForm) {
			this._contactForm.addEventListener('submit', (event) => {
				for (const [key] of this.fields) {
					this._dataModel.setContactsField(
						key as keyof IContactsForm,
						this.getFieldValue(key)
					);
				}

				this._dataModel.emit('contactsForm:submit');

				event.preventDefault();
			});
		}
	}

	protected validateField(name: string): boolean {
		const field = this.fields.get(name);
		if (!field) return false;

		const value = field.value.trim();
		let isValid = true;
		let errorMessage = '';

		if (name === 'email') {
			if (!value) {
				isValid = false;
				errorMessage = 'Поле обязательно для заполнения';
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
				isValid = false;
				errorMessage = 'Введите корректный email';
			}
		} else if (name === 'phone') {
			if (!value) {
				isValid = false;
				errorMessage = 'Поле обязательно для заполнения';
			} else if (!/^\+?\d{10,15}$/.test(value)) {
				isValid = false;
				errorMessage = 'Введите корректный номер телефона';
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
}
