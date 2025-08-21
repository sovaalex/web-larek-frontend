import { Form } from './Form';

export class ContactForm extends Form {
    constructor(container: HTMLFormElement) {
        super(container);
    }

    protected validateField(name: string): boolean {
        const field = this.fields.get(name);
        if (!field) return false;

        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Поле обязательно для заполнения';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректный email';
                }
                break;
            case 'phone':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Поле обязательно для заполнения';
                } else if (!/^\+?\d{10,15}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректный номер телефона';
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
}
