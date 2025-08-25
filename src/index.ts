import './scss/styles.scss';
import { CustomAPI } from './components/CustomAPI';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { CardPreview } from './components/CardPreview';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { BasketItem } from './components/BasketItem';
import { OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { AppDataModel } from './components/DataModel';
import { API_URL, CDN_URL } from './utils/constants';
import { IBaseItem, IBasketItem } from './types';
import { Success } from './components/Success';
import { cloneTemplate } from './utils/utils';

const cardCatalogTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;

const api = new CustomAPI(CDN_URL, API_URL);
const page = new Page(document.body);
const modal = new Modal(
	document.querySelector('#modal-container') as HTMLElement
);
const dataModel = new AppDataModel();
const orderForm = new OrderForm(cloneTemplate(orderTemplate), dataModel);
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), dataModel);
const successElement = new Success(cloneTemplate(successTemplate), dataModel);
const basket = new Basket(cloneTemplate(basketTemplate))

async function loadProducts() {
	try {
		const products = (await api.getProductList()) as IBaseItem[];
		dataModel.products = products;
	} catch (error) {
		console.error('Ошибка загрузки товаров:', error);
	}
}

function renderBasket(basketInstance: Basket, items: IBasketItem[]) {
	const itemsElement = basketInstance.itemsElement as HTMLElement;
	const priceElement = basketInstance.priceElement as HTMLElement;
	const buttonElement = basketInstance.buttonElement as HTMLButtonElement;

	itemsElement.innerHTML = '';

	if (items.length === 0) {
		const emptyMessage = document.createElement('p');
		emptyMessage.textContent = 'Корзина пуста';
		emptyMessage.className = 'basket_empty';
		itemsElement.appendChild(emptyMessage);

		buttonElement.disabled = true;
		buttonElement.classList.add('basket__button_disabled');
	} else {
		buttonElement.disabled = false;
		buttonElement.classList.remove('basket__button_disabled');

		items.forEach((item, index) => {
			const basketItemTemplate = document.querySelector(
				'#card-basket'
			) as HTMLTemplateElement;
			if (basketItemTemplate) {
				const templateContent = basketItemTemplate.content.cloneNode(
					true
				) as HTMLElement;
				const basketItemElement = templateContent.querySelector(
					'.basket__item'
				) as HTMLElement;

				if (basketItemElement) {
					const basketItem = new BasketItem(basketItemElement, {
						onClick: () => {
							dataModel.removeFromBasket(item.id);
							renderBasket(basketInstance, dataModel.basket);
						},
					});

					basketItem.id = item.id;
					basketItem.title = `${item.title}`;
					basketItem.price = item.price;
					basketItem.index = String(index + 1);

					itemsElement.appendChild(basketItemElement);
				}
			}
		});

		buttonElement.addEventListener('click', () => {
			openOrderForm();
		});
	}

	const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
	priceElement.textContent = `${total} синапсов`;
}

function openBasket() {
	basket.items = dataModel.basket;

	renderBasket(basket, dataModel.basket);

	modal.content = basket.render();
	modal.open();
}

function openSuccessForm() {
	successElement.callback = () => {
		modal.close();
	};
	dataModel.clearBasket();
	modal.content = successElement.render();
}

function openContactsForm() {
	modal.content = contactForm.render();
}

function openOrderForm() {
	dataModel.order.items = dataModel.preparedBasketIds;
	dataModel.order.total = dataModel.basketTotal;

	modal.content = orderForm.render();
}

dataModel.on('products:changed', (products: IBaseItem[]) => {
	page.catalog = products.map((product: IBaseItem) => {
		const cardElement = cardCatalogTemplate.content.cloneNode(
			true
		) as HTMLElement;
		const cardButton = cardElement.querySelector('.card') as HTMLElement;
		new Card(cardButton, product);
		cardButton.addEventListener('click', () => {
			dataModel.emit('item:openPreview', product);
		});

		return cardElement;
	});
});

dataModel.on('item:openPreview', (product: IBaseItem) => {
	const previewElement = cardPreviewTemplate.content.cloneNode(
		true
	) as HTMLElement;

	new CardPreview(
		previewElement.querySelector('.card') as HTMLElement,
		product
	);

	const button = previewElement.querySelector(
		'.card__button'
	) as HTMLButtonElement;
	if (button) {
		button.addEventListener('click', () => {
			dataModel.addToBasket(product);
			modal.close();
		});
	}

	modal.content = previewElement;
	modal.open();
});

dataModel.on('basket:changed', () => {
	const basketCounter = document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;
	if (basketCounter) {
		basketCounter.textContent = String(dataModel.basketCount);
	}
});

dataModel.on('contactsForm:submit', () => {
	try {
		api.orderResult(dataModel.order).then((data) => {
			if (data?.id) {
				dataModel.orderSuccess = data;
				openSuccessForm();
			}
		});
	} catch (error: unknown) {}
});

dataModel.on('orderForm:submit', () => {
	openContactsForm();
});

document.addEventListener('DOMContentLoaded', () => {
	loadProducts();

	const basketButton = document.querySelector('.header__basket') as HTMLElement;
	if (basketButton) {
		basketButton.addEventListener('click', openBasket);
	}
});
