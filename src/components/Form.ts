import { IFormBase } from '../types';
import { Component } from './base/component';

export class Form extends Component<IFormBase> {
	protected _submitButton: HTMLButtonElement;
	protected _formErrors: HTMLSpanElement;
	protected fields: Map<string, HTMLInputElement> = new Map();
	protected errors: Map<string, HTMLElement> = new Map();
	protected _errors: Map<string, string> = new Map();

	constructor(container: HTMLFormElement) {
		super(container);
		this._submitButton = container.querySelector(
			'.button[type="submit"]'
		) as HTMLButtonElement;
		this._formErrors = container.querySelector(
			'.form__errors'
		) as HTMLSpanElement;
		this.initializeFields();
		this.bindEvents();
	}

	protected initializeFields() {
		this.fields.clear();

		const inputs = this.container.querySelectorAll('input, textarea, select');
		inputs.forEach((input) => {
			const name = (input as HTMLInputElement).name;
			if (name) {
				this.fields.set(name, input as HTMLInputElement);
				const errorElement = this.container.querySelector(
					`.form__error[name="${name}"]`
				);
				if (errorElement) {
					this.errors.set(name, errorElement as HTMLElement);
				}
			}
		});
	}

	protected bindEvents() {
		this.fields.forEach((field, name) => {
			field.addEventListener('input', () => this.onFieldChange(name));
			field.addEventListener('blur', () => this.validateField(name));
		});
	}

	protected validateField(name: string): boolean {
		const field = this.fields.get(name);
		if (!field) return false;

		const value = field.value.trim();
		const isValid = value !== '';

		if (!isValid) {
			this.showError(name, 'Поле обязательно для заполнения');
		} else {
			this.hideError(name);
		}

		return isValid;
	}

	protected showError(name: string, message: string) {
		const field = this.fields.get(name);
		if (field) {
			this._errors.set(name, message);
		}

		let error = '';

		for (const [name, value] of this._errors) {
			if (value && !error) {
				error = value;
			}
		}

		this._formErrors.innerHTML = error;
	}

	protected hideError(name: string) {
		this.showError(name, '');
	}

	protected validateForm(): boolean {
		let isValid = true;
		this.fields.forEach((_, name) => {
			if (!this.validateField(name)) {
				isValid = false;
			}
		});
		return isValid;
	}

	protected onFieldChange(name: string) {
		this.validateField(name);
		this.updateSubmitButton();
	}

	protected updateSubmitButton() {
		const isValid = this.validateForm();
		this.setDisabled(this._submitButton, !isValid);
	}

	setFieldValue(name: string, value: string) {
		const field = this.fields.get(name);
		if (field) {
			field.value = value;
			this.validateField(name);
		}
	}

	getFieldValue(name: string): string {
		const field = this.fields.get(name);
		return field ? field.value.trim() : '';
	}

	getFormData(): Record<string, string> {
		const data: Record<string, string> = {};
		this.fields.forEach((field, name) => {
			data[name] = field.value.trim();
		});
		return data;
	}

	setFormData(data: Record<string, string>) {
		Object.keys(data).forEach((name) => {
			this.setFieldValue(name, data[name]);
		});
	}

	clearForm() {
		this.fields.forEach((field) => {
			field.value = '';
			field.classList.remove('form__input_error');
		});
		this.errors.forEach((error) => {
			error.textContent = '';
			error.style.display = 'none';
		});
		this.updateSubmitButton();
	}

	render(data: Partial<IFormBase> = {}) {
		console.log('Form render called, container:', this.container);
		if (data.valid !== undefined) {
			this.setDisabled(this._submitButton, !data.valid);
		}
		return this.container;
	}
}
