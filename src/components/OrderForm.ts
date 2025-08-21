import { Form } from './Form';
import { IOrderForm } from '../types';
import { AppDataModel } from './DataModel';

export class OrderForm extends Form {
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, dataModel: AppDataModel) {
        super(container);
        
        this._cardButton = container.querySelector('.button[name="card"]') as HTMLButtonElement;
        this._cashButton = container.querySelector('.button[name="cash"]') as HTMLButtonElement;
        
        this.bindPaymentEvents();
    }

    protected bindPaymentEvents() {
        if (this._cardButton) {
            this._cardButton.addEventListener('click', () => this.selectPayment('card'));
        }
        if (this._cashButton) {
            this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
        }
    }

    protected selectPayment(payment: string) {
        this.setFieldValue('payment', payment);

        if (this._cardButton) {
            this._cardButton.classList.toggle('button_alt-active', payment === 'card');
        }
        if (this._cashButton) {
            this._cashButton.classList.toggle('button_alt-active', payment === 'cash');
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

        switch (name) {
            case 'payment':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Выберите способ оплаты';
                }
                break;
            case 'address':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Поле обязательно для заполнения';
                } else if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'Адрес должен содержать минимум 5 символов';
                }
                break;
            default:
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
