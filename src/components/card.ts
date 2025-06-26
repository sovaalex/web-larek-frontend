import { IProduct as Product } from '../types';
import { CDN_URL } from '../utils/constants';
import { basket } from './basket';
import { CardPreview } from './cardPreview';

export function getCategoryClass(category: string): string {
    switch (category.toLowerCase()) {
        case 'софт-скил':
            return 'card__category_soft';
        case 'другое':
            return 'card__category_other';
        case 'дополнительное':
            return 'card__category_additional';
        case 'кнопка':
            return 'card__category_button';
        case 'хард-скил':
            return 'card__category_hard';
        default:
            return '';
    }
}

export class Card {
    private product: Product;
    private element: HTMLElement;
    private cardPreview: CardPreview;

    constructor(product: Product) {
        this.product = product;
        this.element = this.createCardElement();
        this.cardPreview = new CardPreview({
            id: this.product.id,
            'card__image': `${CDN_URL}${this.product.image}`,
            'card__category': this.product.category || 'категория',
            'card__title': this.product.title,
            'card__text': this.product.description || '',
            'card__price': this.product.price !== null ? `${this.product.price} синапсов` : 'Бесценно',
        });
        this.element.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (this.element.contains(target)) {
                this.openModal();
            }
        });
    }

    private createCardElement(): HTMLElement {
        const template = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template with id "card-catalog" not found');
        }
        const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const categoryElem = card.querySelector('.card__category') as HTMLElement | null;
        if (categoryElem) {
            categoryElem.textContent = this.product.category || 'категория';

            const categoryClass = getCategoryClass(this.product.category || '');
            if (categoryClass) {
                categoryElem.classList.add(categoryClass);
            }
        }

        const titleElem = card.querySelector('.card__title');
        if (titleElem) {
            titleElem.textContent = this.product.title;
        }

        const imgElem = card.querySelector('.card__image') as HTMLImageElement | null;
        if (imgElem) {
            imgElem.src = `${CDN_URL}${this.product.image}`;
            imgElem.alt = this.product.title;
        }

        const priceElem = card.querySelector('.card__price');
        if (priceElem) {
            priceElem.textContent = this.product.price !== null ? `${this.product.price} синапсов` : 'Бесценно';
        }

        return card;
    }

    openModal() {
        this.cardPreview.open();
    }

    getElement(): HTMLElement {
        return this.element;
    }
}
