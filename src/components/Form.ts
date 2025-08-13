import { EventEmitter } from "./base/events";
import { IOrder } from "../types";

export interface IForm extends EventEmitter {
    render(): HTMLFormElement;
    setValue(field: string, value: string): void;
    getValue(field: string): string;
    getAllValues(): IOrder;
    clearValues(): void;
    validate(): boolean;
    setValid(field: string, isValid: boolean): void;
    setSubmitButtonState(isEnabled: boolean): void;
}

export interface IFormConstructor {
    new (template: HTMLTemplateElement): IForm;
}

export class Form extends EventEmitter implements IForm {
    protected formElement: HTMLFormElement;
    protected fields: Map<string, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    protected submitButton: HTMLButtonElement;
    protected errors: Map<string, HTMLElement>;
    protected validators: Map<string, (value: string) => boolean>;

    constructor(template: HTMLTemplateElement) {
        super();
        this.fields = new Map();
        this.errors = new Map();
        this.validators = new Map();
        
        this.formElement = template.content.querySelector('form').cloneNode(true) as HTMLFormElement;
        this.submitButton = this.formElement.querySelector('.button[type="submit"]');
        
        this.initFields();
        this.bindEvents();
    }

    protected initFields(): void {
        const inputs = this.formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const name = (input as HTMLInputElement).name;
            if (name) {
                (input as HTMLInputElement).id = name;
                this.fields.set(name, input as HTMLInputElement);
                this.setupValidation(name);
            }
        });

        if (!this.fields.has('payment')) {
            const paymentInput = document.createElement('input');
            paymentInput.type = 'hidden';
            paymentInput.name = 'payment';
            paymentInput.id = 'payment';
            paymentInput.value = '';
            this.formElement.appendChild(paymentInput);
            this.fields.set('payment', paymentInput);
        }
    }

    protected bindEvents(): void {
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            if (this.validate()) {
                this.emit('form:submit', this.getAllValues());
            }
        });

        this.fields.forEach((field, name) => {
            field.addEventListener('input', () => {
                this.emit('form:input', { field: name, value: this.getValue(name) });
                this.validateField(name);
                this.setSubmitButtonState(this.validate());
            });

            field.addEventListener('blur', () => {
                this.validateField(name);
                this.setSubmitButtonState(this.validate());
            });
        });

        const paymentButtons = this.formElement.querySelectorAll('.button_alt');
        paymentButtons.forEach(button => {
            if (button.textContent?.includes('Онлайн')) {
                button.setAttribute('data-payment', 'card');
            } else if (button.textContent?.includes('При получении')) {
                button.setAttribute('data-payment', 'cash');
            }

            button.addEventListener('click', (evt) => {
                evt.preventDefault();

                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                button.classList.add('button_alt-active');

                const paymentField = this.fields.get('payment') as HTMLInputElement;
                if (paymentField) {
                    const paymentValue = button.getAttribute('data-payment') || 
                                       (button.getAttribute('name') === 'card' ? 'card' : 
                                        button.getAttribute('name') === 'cash' ? 'cash' : '');
                    paymentField.value = paymentValue;
                    this.validateField('payment');
                    this.setSubmitButtonState(this.validate());
                }
            });
        });
    }

    protected setupValidation(fieldName: string): void {
        const regexPatterns: { [key: string]: RegExp } = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^\+?\d{10,15}$/,
            address: /^(?=.*[а-яА-ЯёЁa-zA-Z])(?=.*\d).{5,}$/,
            payment: /^(card|cash)$/,
            default: /.+/
        };

        const pattern = regexPatterns[fieldName] || regexPatterns.default;
        this.validators.set(fieldName, (value) => pattern.test(value.trim()));
    }

    render(): HTMLFormElement {
        return this.formElement;
    }

    setValue(field: string, value: string): void {
        const input = this.fields.get(field);
        if (input) {
            input.value = value;
            this.validateField(field);
        }
    }

    getValue(field: string): string {
        const input = this.fields.get(field);
        return input ? input.value : '';
    }

    getAllValues(): IOrder {
        const values: IOrder = {
            address: '',
            items: [],
            payment: 'card',
            email: '',
            phone: '',
            total: 0
        };

        const addressField = this.fields.get('address');
        if (addressField) {
            values.address = addressField.value;
        }
        
        const emailField = this.fields.get('email');
        if (emailField) {
            values.email = emailField.value;
        }
        
        const phoneField = this.fields.get('phone');
        if (phoneField) {
            values.phone = phoneField.value;
        }

        const paymentField = this.fields.get('payment');
        if (paymentField && paymentField.value) {
            values.payment = paymentField.value as 'card' | 'cash';
        }

        const activePaymentButton = this.formElement.querySelector('.button_alt.button_alt-active');
        if (activePaymentButton) {
            const paymentType = activePaymentButton.getAttribute('data-payment') as 'card' | 'cash';
            if (paymentType === 'card' || paymentType === 'cash') {
                values.payment = paymentType;

                if (paymentField) {
                    paymentField.value = paymentType;
                }
            }
        }
        
        return values;
    }

    clearValues(): void {
        this.formElement.reset();
        this.errors.forEach(error => error.textContent = '');
    }

    validate(): boolean {
        let isValid = true;
        this.fields.forEach((_, name) => {
            if (!this.validateField(name)) {
                isValid = false;
            }
        });
        return isValid;
    }

    protected validateField(fieldName: string): boolean {
        const field = this.fields.get(fieldName);
        const validator = this.validators.get(fieldName);
        
        if (!field || !validator) return true;

        const isValid = validator(field.value);
        this.setValid(fieldName, isValid);
        
        return isValid;
    }

    setValid(field: string, isValid: boolean): void {
        const input = this.fields.get(field);
        if (input) {
            input.classList.toggle('form__input_error', !isValid);
            this.showError(field, isValid ? '' : this.getErrorMessage(field));
        }
    }

    protected showError(field: string, message: string): void {
        const errorElement = this.errors.get(field) || this.createErrorElement(field);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    protected createErrorElement(field: string): HTMLElement {
        const errorContainer = document.querySelector('.modal__actions');

        let errorElement = errorContainer.querySelector('.form__errors');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'form__errors';
            errorContainer.appendChild(errorElement);
        }
        
        this.errors.set(field, errorElement as HTMLElement);
        return errorElement as HTMLElement;
    }

    protected getErrorMessage(field: string): string {
        const fieldNames: { [key: string]: string } = {
            email: 'email',
            phone: 'номер телефона',
            address: 'адрес',
            payment: 'способ оплаты'
        };
        
        const fieldName = fieldNames[field] || field;
        
        switch (field) {
            case 'email':
                return 'Необходимо указать корректный email';
            case 'phone':
                return 'Необходимо указать корректный номер телефона';
            case 'address':
                return 'Необходимо указать адрес доставки';
            case 'payment':
                return 'Необходимо выбрать способ оплаты';
            default:
                return `Необходимо заполнить поле ${fieldName}`;
        }
    }

    setSubmitButtonState(isEnabled: boolean): void {
        if (this.submitButton) {
            this.submitButton.disabled = !isEnabled;
        }
    }
}
