import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { CustomAPI } from './components/CustomAPI';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { CardPreview } from './components/CardPreview';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { AppDataModel } from './components/DataModel';
import { API_URL, CDN_URL } from './utils/constants';
import { IBaseItem } from './types';

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;

const events = new EventEmitter();
const api = new CustomAPI(CDN_URL, API_URL);
const page = new Page(document.body);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement);
const dataModel = new AppDataModel();

events.on('products:changed', (products: IBaseItem[]) => {
    page.catalog = products.map((product: IBaseItem) => {
        const cardElement = cardCatalogTemplate.content.cloneNode(true) as HTMLElement;
        
        const card = new Card(cardElement.querySelector('.card') as HTMLElement, product);
        cardElement.addEventListener('click', () => {
            events.emit('item:openPreview', product);
        });
        
        return cardElement;
    });
});

events.on('item:openPreview', (product: IBaseItem) => {
    const previewElement = cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
    
    const cardPreview = new CardPreview(previewElement.querySelector('.card') as HTMLElement, product);
    const button = previewElement.querySelector('.card__button');
    if (button) {
        button.addEventListener('click', () => {
            dataModel.addToBasket(product);
            modal.close();
        });
    }
    
    modal.content = previewElement;
    modal.open();
});

events.on('basket:changed', (basketItems: IBaseItem[]) => {
    const basketCounter = document.querySelector('.header__basket-counter');
    if (basketCounter) {
        basketCounter.textContent = String(basketItems.length);
    }
});

async function loadProducts() {
    try {
        const products = await api.getProductList() as IBaseItem[];
        dataModel.products = products;
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

function openBasket() {
    const basketElement = basketTemplate.content.cloneNode(true) as HTMLElement;
    
    const basketInstance = new Basket(basketElement.querySelector('.basket') as HTMLElement);
    basketInstance.items = dataModel.basket;
    
    modal.content = basketElement;
    modal.open();
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    const basketButton = document.querySelector('.header__basket');
    if (basketButton) {
        basketButton.addEventListener('click', openBasket);
    }
});
