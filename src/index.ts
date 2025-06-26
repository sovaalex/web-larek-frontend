import './scss/styles.scss';
import { Catalog } from './components/catalog';
import { Modal } from './components/modal'; 
import { basket } from './components/basket';
import { Order } from './components/order';
import { Card } from './components/card';

const catalog = new Catalog('.gallery');
catalog.loadProducts('/product').then(async () => {
    try {
        const response = await catalog['api'].get('/product');
        const products = (response as any).items;
        const container = document.querySelector('.gallery');
        if (container) {
            container.innerHTML = '';
            products.forEach((product: any) => {
                const card = new Card(product);
                container.appendChild(card.getElement());
            });
        }
    } catch (error) {
        const container = document.querySelector('.gallery');
        if (container) {
            container.innerHTML = '<p>Ошибка загрузки продуктов</p>';
        }
    }
});

const basketButton = document.querySelector('.header__basket');
const basketCounter = document.querySelector('.header__basket-counter');

function updateBasketCounter() {
    if (!basketCounter) return;
    const items = basket.getItems();
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    basketCounter.textContent = totalQuantity.toString();
}

basket.subscribe(updateBasketCounter);
updateBasketCounter();

const order = new Order();

class BasketUI {
    private listElement: HTMLElement | null = null;
    private priceElement: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    private orderButton: HTMLButtonElement | null = null;

    constructor() {}

    public init(container: HTMLElement) {
        this.container = container;
        this.listElement = container.querySelector('.basket__list');
        this.priceElement = container.querySelector('.basket__price');
        this.orderButton = container.querySelector('.basket__button');

        this.render();
        basket.subscribe(() => this.render());

        if (this.orderButton) {
            this.orderButton.addEventListener('click', () => {
                order.start();
            });
        }
    }

    public render() {
        if (!this.listElement || !this.priceElement) return;

        const items = basket.getItems();
        this.listElement.innerHTML = '';

        let totalPrice = 0;
        items.forEach((item, index) => {
            totalPrice += item.price * item.quantity;
            const li = document.createElement('li');
            li.className = 'basket__item card card_compact';
            li.innerHTML = `
                <span class="basket__item-index">${index + 1}</span>
            <span class="card__title">${item.title || item.productId}</span>
                <span class="card__price">${item.price} синапсов</span>
                <button class="basket__item-delete" aria-label="удалить" data-id="${item.productId}"></button>
            `;
            this.listElement.appendChild(li);
        });

        this.priceElement.textContent = `${totalPrice} синапсов`;

        if (this.orderButton) {
            this.orderButton.disabled = items.length === 0;
        }

        this.listElement.querySelectorAll('.basket__item-delete').forEach(button => {
            button.addEventListener('click', (event) => {
                const target = event.currentTarget as HTMLElement;
                const id = target.getAttribute('data-id');
                if (id) {
                    basket.removeItem(id);
                }
            });
        });
    }
}

const basketUI = new BasketUI();

if (basketButton) {
    basketButton.addEventListener('click', () => {
        Modal.openModal({
            templateId: 'basket',
            data: {}
        });
        const modal = document.querySelector('.modal_active');
        if (modal instanceof HTMLElement) {
            basketUI.init(modal);
        }
    });
}