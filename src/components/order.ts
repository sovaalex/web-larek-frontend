import { Modal } from './modal';
import { basket } from './basket';
import { IOrderData } from '../types';

export class Order {
    private currentStep: number;
    private modalElement: HTMLElement | null = null;
    private paymentButtonsContainer: HTMLElement | null = null;
    private paymentButtons: NodeListOf<HTMLButtonElement> | null = null;
    private addressInput: HTMLInputElement | null = null;
    private nextButton: HTMLButtonElement | null = null;
    private form: HTMLFormElement | null = null;
    private orderData: IOrderData | null = null;

    constructor() {
        this.currentStep = 0;
        this.orderData = null;
    }

    public start() {
        this.openStep(0);
    }

    private openStep(step: number) {
        this.currentStep = step;
        Modal.closeModal();
        switch (step) {
            case 0:
                this.openPaymentStep();
                break;
            case 1:
                this.openContactsStep();
                break;
            case 2:
                this.openSuccessStep();
                break;
            default:
                break;
        }
    }

    private openPaymentStep() {
        Modal.openModal({
            templateId: 'order',
            data: {}
        });

        requestAnimationFrame(() => {
            this.modalElement = document.querySelector('.modal_active') as HTMLElement | null;
            if (this.modalElement) {
                const contentContainer = this.modalElement.querySelector('.modal__content') as HTMLElement | null;
                if (contentContainer) {
                    this.initPaymentForm(contentContainer);
                }
            }
        });
    }

    private initPaymentForm(modal: HTMLElement) {
        this.form = modal.querySelector('form[name="order"]');
        if (!this.form) return;

        this.addressInput = this.form.querySelector('input[name="address"]');
        this.nextButton = this.form.querySelector('button.order__button');

        let addressError = this.form.querySelector('.address-error') as HTMLElement | null;
        if (!addressError && this.addressInput) {
            addressError = document.createElement('div');
            addressError.className = 'address-error';
            addressError.style.color = 'red';
            this.addressInput.insertAdjacentElement('afterend', addressError);
        }

        this.paymentButtonsContainer = this.form.querySelector('.order__buttons');
        if (!this.paymentButtonsContainer) return;

        this.paymentButtons = this.paymentButtonsContainer.querySelectorAll('button.button_alt');
        if (!this.paymentButtons) return;

        let activeSet = false;
        this.paymentButtons.forEach(button => {
            button.disabled = false;
            if (!activeSet && button.textContent?.trim().toLowerCase() === 'онлайн') {
                this.setButtonAttributes(button, true);
                activeSet = true;
            } else {
                this.setButtonAttributes(button, false);
            }
        });

        this.paymentButtonsContainer.addEventListener('click', this.onPaymentButtonClick);

        if (this.addressInput) {
            this.addressInput.addEventListener('input', () => {
                this.validatePaymentForm();
                if (addressError && this.addressInput) {
                    if (this.addressInput.value.trim() === '') {
                        addressError.textContent = 'Поле не заполнено';
                    } else {
                        addressError.textContent = '';
                    }
                }
            });
        }

        if (this.addressInput) {
            this.addressInput.addEventListener('blur', () => {
                if (addressError && this.addressInput) {
                    if (this.addressInput.value.trim() === '') {
                        addressError.textContent = 'Поле не заполнено';
                        addressError.style.color = 'red';
                    } else {
                        addressError.textContent = '';
                    }
                }
            });
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const paymentSelected = Array.from(this.paymentButtons || []).some(button => button.classList.contains('button_alt-active'));
            if (!this.form.checkValidity() || !paymentSelected) {
                this.form.reportValidity();
                if (addressError && this.addressInput && this.addressInput.value.trim() === '') {
                    addressError.textContent = 'Поле не заполнено';
                }
                return;
            }
            if (addressError) {
                addressError.textContent = '';
            }
            this.openStep(1);
        });

        this.validatePaymentForm();
    }

    private setButtonAttributes(button: HTMLButtonElement, selected: boolean) {
        if (selected) {
            button.classList.add('button_alt-active');
        } else {
            button.classList.remove('button_alt-active');
        }
    }

    private onPaymentButtonClick = (event: Event) => {
        const target = event.target as HTMLElement;
        const button = target.closest('button.button_alt') as HTMLButtonElement | null;
        if (!button || !this.paymentButtons) return;

        this.paymentButtons.forEach(btn => this.setButtonAttributes(btn, false));
        this.setButtonAttributes(button, true);

        this.validatePaymentForm();
    };

    private validatePaymentForm = () => {
        if (this.addressInput && this.addressInput.value.trim() !== '') {
            if (this.nextButton) this.nextButton.disabled = false;
        } else {
            if (this.nextButton) this.nextButton.disabled = true;
        }
    };

    private openContactsStep() {
        Modal.openModal({
            templateId: 'contacts',
            data: {}
        });

        requestAnimationFrame(() => {
            this.modalElement = document.querySelector('.modal_active');
            if (this.modalElement) {
                this.initContactsForm(this.modalElement);
            }
        });
    }

    private initContactsForm(modal: HTMLElement) {
        this.form = modal.querySelector('form[name="contacts"]') as HTMLFormElement | null;
        if (!this.form) return;

        const emailInput = this.form.querySelector('input[name="email"]') as HTMLInputElement | null;
        const phoneInput = this.form.querySelector('input[name="phone"]') as HTMLInputElement | null;
        const payButton = this.form.querySelector('button') as HTMLButtonElement | null;

        let emailError = this.form.querySelector('.email-error') as HTMLElement | null;
        if (!emailError && emailInput) {
            emailError = document.createElement('div');
            emailError.className = 'email-error';
            emailError.style.color = 'red';
            emailInput.insertAdjacentElement('afterend', emailError);
        }

        let phoneError = this.form.querySelector('.phone-error') as HTMLElement | null;
        if (!phoneError && phoneInput) {
            phoneError = document.createElement('div');
            phoneError.className = 'phone-error';
            phoneError.style.color = 'red';
            phoneInput.insertAdjacentElement('afterend', phoneError);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,15}$/;

        const validateContactsForm = () => {
            const emailValue = emailInput ? emailInput.value.trim() : '';
            const phoneValue = phoneInput ? phoneInput.value.trim() : '';
            const emailValid = emailInput && emailRegex.test(emailValue);
            const phoneValid = phoneInput && phoneRegex.test(phoneValue);

            if (emailError && emailInput) {
                if (emailValue === '') {
                    emailError.textContent = 'Поле не заполнено';
                    emailError.style.color = 'red';
                } else if (!emailValid) {
                    emailError.textContent = 'Неверный формат email';
                    emailError.style.color = 'red';
                } else {
                    emailError.textContent = '';
                }
            }

            if (phoneError && phoneInput) {
                if (phoneValue === '') {
                    phoneError.textContent = 'Поле не заполнено';
                    phoneError.style.color = 'red';
                } else if (!phoneValid) {
                    phoneError.textContent = 'Неверный формат телефона';
                    phoneError.style.color = 'red';
                } else {
                    phoneError.textContent = '';
                }
            }

            if (payButton) {
                payButton.disabled = !(emailValid && phoneValid);
            }
        };

        let emailTouched = false;
        let phoneTouched = false;

        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailTouched) {
                    validateContactsForm();
                }
            });
            emailInput.addEventListener('blur', () => {
                emailTouched = true;
                validateContactsForm();
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                if (phoneTouched) {
                    validateContactsForm();
                }
            });
            phoneInput.addEventListener('blur', () => {
                phoneTouched = true;
                validateContactsForm();
            });
        }

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!this.form.checkValidity()) {
                this.form.reportValidity();
                return;
            }
            this.openStep(2);
        });

        validateContactsForm();
    }

    private openSuccessStep() {
        const totalPrice = this.calculateTotalPrice();
        Modal.openModal({
            templateId: 'success',
            data: {
                'order-success__description': `Списано ${totalPrice} синапсов`
            }
        });

        basket.clearItems();

        requestAnimationFrame(() => {
            this.modalElement = document.querySelector('.modal_active');
            if (this.modalElement) {
                const closeButton = this.modalElement.querySelector('.order-success__close');
                if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        this.close();
                    });
                }
            }
        });
    }

    private calculateTotalPrice(): number {
        const items = basket.getItems();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    public close() {
        Modal.closeModal();
    }
}
