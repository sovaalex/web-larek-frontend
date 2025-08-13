import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { CustomAPI } from './components/CustomAPI';
import { Page } from './components/Page';
import { ItemPresenter } from './components/ItemPresenter';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { BasketPresenter } from './components/BasketPresenter';
import { Form } from './components/Form';
import { Success } from './components/Success';
import { CDN_URL, API_URL } from './utils/constants';
import { IOrder } from './types';

const events = new EventEmitter();
const api = new CustomAPI(CDN_URL, API_URL);

const pageContainer = document.querySelector('.page') as HTMLElement;
const page = new Page(pageContainer, events);

const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

const basketContainer = document.querySelector('.basket') as HTMLElement;
const basket = new Basket(basketContainer, events);

const basketPresenter = new BasketPresenter(events, basket, page);

const itemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const itemPresenter = new ItemPresenter(
    events,
    page,
    itemTemplate,
    modal,
    cardPreviewTemplate
);

function createBasketView(items: any[], total: number): HTMLElement {
    const content = basketTemplate.content.cloneNode(true) as HTMLElement;
    const basketElement = content.querySelector('.basket') as HTMLElement;
    const list = basketElement.querySelector('.basket__list') as HTMLElement;
    const totalElement = basketElement.querySelector('.basket__price') as HTMLElement;
    const checkoutButton = basketElement.querySelector('.basket__button') as HTMLButtonElement;

    totalElement.textContent = `${total} синапсов`;

    if (items.length === 0) {
        list.innerHTML = '<div class="basket__item_empty">Корзина пуста</div>';
        checkoutButton.disabled = true;
        checkoutButton.classList.add('basket__button_disabled');
    } else {
        items.forEach((item, index) => {
            const itemElement = createBasketItem(item, index + 1);
            list.appendChild(itemElement);
        });
        checkoutButton.disabled = false;
        checkoutButton.classList.remove('basket__button_disabled');
    }

    checkoutButton.addEventListener('click', () => {
        if (items.length > 0) {
            events.emit('basket:checkout');
        }
    });

    return basketElement;
}

function createBasketItem(item: any, index: number): HTMLElement {
    const content = cardBasketTemplate.content.cloneNode(true) as HTMLElement;
    const itemElement = content.querySelector('.basket__item') as HTMLElement;
    const indexElement = itemElement.querySelector('.basket__item-index') as HTMLElement;
    const titleElement = itemElement.querySelector('.card__title') as HTMLElement;
    const priceElement = itemElement.querySelector('.card__price') as HTMLElement;
    const deleteButton = itemElement.querySelector('.basket__item-delete') as HTMLButtonElement;

    indexElement.textContent = String(index);
    titleElement.textContent = item.title;
    priceElement.textContent = `${item.price * item.quantity} синапсов`;

    deleteButton.addEventListener('click', () => {
        basket.removeItem(item.id);
    });

    return itemElement;
}

events.on('basket:open', () => {
    const items = basket.items;
    const total = basket.total;
    const basketView = createBasketView(items, total);
    modal.setContent(basketView);
    modal.open();
});

events.on('basket:changed', () => {
    const items = basket.items;
    const total = basket.total;

    page.setBasketCounter(basket.getItemCount());

    if (modal.isOpen()) {
        const basketView = createBasketView(items, total);
        modal.setContent(basketView);
    }
});

function createOrderForm(): HTMLElement {
    const form = new Form(orderTemplate);
    
    form.on('form:submit', (data) => {
        events.emit('order:submit', data);
    });
    
    return form.render();
}

function createContactsForm(): HTMLElement {
    const form = new Form(contactsTemplate);
    
    form.on('form:submit', (data) => {
        events.emit('contacts:submit', data);
    });
    
    return form.render();
}

const successContainer = document.querySelector('#modal-container') as HTMLElement;
const success = new Success(successContainer, events);

events.on('basket:checkout', () => {
    const orderForm = createOrderForm();
    modal.setContent(orderForm);
});

let orderFormData: any = {};

events.on('order:submit', (orderData) => {
    orderFormData = orderData;
    const contactsForm = createContactsForm();
    modal.setContent(contactsForm);
});

events.on('contacts:submit', async (contactData: IOrder) => {
    try {
        const finalOrderData = {
            items: basket.items.flatMap(item => Array(item.quantity || 1).fill(item.id)),
            total: basket.total,
            address: orderFormData.address,
            payment: orderFormData.payment,
            email: contactData.email,
            phone: contactData.phone
        };

        await api.orderResult(finalOrderData);

        const successContent = successTemplate.content.cloneNode(true) as HTMLElement;
        const successElement = successContent.querySelector('.order-success') as HTMLElement;
        const descriptionElement = successElement.querySelector('.order-success__description') as HTMLElement;

        descriptionElement.textContent = `Списано ${basket.total} синапсов`;

        const closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
        closeButton.addEventListener('click', () => {
            basket.clear();
            modal.close();
        });
        
        modal.setContent(successElement);
        modal.open();
        
    } catch (error) {
        console.error('Failed to create order:', error);
    }
});

events.on('success:close', () => {
    modal.close();
});

async function initializeApp() {
    try {
        const products = await api.getProductList();
        itemPresenter.displayItems(products);
        page.setBasketCounter(0);
        itemPresenter.init();
        basketPresenter.init();
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
