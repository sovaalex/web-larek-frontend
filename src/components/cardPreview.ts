import { Modal } from './modal';
import { basket } from './basket';
import { getCategoryClass } from './card';

export class CardPreview extends Modal {
    private data: Record<string, any>;
    private addToBasketHandler: () => void;

    constructor(data: Record<string, any>) {
        super();
        this.data = data;
        this.addToBasketHandler = this.addToBasket.bind(this);
    }

    open() {
        Modal.openModal({
            templateId: 'card-preview',
            data: this.data
        });
        this.applyCategoryColor();
        this.initEventListeners();
    }

    private applyCategoryColor() {
        const modal = document.querySelector('.modal_active');
        if (!modal) return;

        const categoryElem = modal.querySelector('.card__category');
        if (!categoryElem) return;

        const category = (this.data.card__category || '').toLowerCase();

        categoryElem.classList.remove(
            'card__category_soft',
            'card__category_other',
            'card__category_additional',
            'card__category_button',
            'card__category_hard'
        );

        const categoryClass = getCategoryClass(category);
        if (categoryClass) {
            categoryElem.classList.add(categoryClass);
        }
    }

    close() {
        Modal.closeModal();
    }

    addToBasket() {
        const priceString = this.data.card__price || '';
        const priceMatch = priceString.match(/(\d+)/);
        if (!priceMatch) {
            const priceStringLower = priceString.toLowerCase();
            if (priceStringLower === 'бесценно') {
                basket.addItem({
                    productId: String(this.data.id),
                    quantity: 1,
                    price: 0
                });
                this.close();
                return;
            }
            return;
        }
        const price = Number(priceMatch[1]);
        basket.addItem({
            productId: String(this.data.id),
            title: this.data.card__title || '',
            quantity: 1,
            price: price
        });
        this.close();
    }

    private initEventListeners() {
        const modal = document.querySelector('.modal_active');
        if (!modal) return;

        const button = modal.querySelector('.card__button');
        if (button) {
            button.removeEventListener('click', this.addToBasketHandler);
            button.addEventListener('click', this.addToBasketHandler);
        }
    }
}