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
const basketItemTemplate = document.querySelector(
			'#card-basket'
		) as HTMLTemplateElement;

const api = new CustomAPI(CDN_URL, API_URL);
const dataModel = new AppDataModel();
const page = new Page(document.body, dataModel);
const modal = new Modal(
	document.querySelector('#modal-container') as HTMLElement
);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), dataModel);
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), dataModel);
const successElement = new Success(cloneTemplate(successTemplate), dataModel);
const basket = new Basket(cloneTemplate(basketTemplate), dataModel)

async function loadProducts() {
	try {
		const products = (await api.getProductList()) as IBaseItem[];
		dataModel.products = products;
	} catch (error) {
		console.error('Ошибка загрузки товаров:', error);
	}
}

function openSuccessForm() {
	successElement.callback = () => {
		modal.close();
	};
	modal.content = successElement.render();
	dataModel.clearBasket();
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
		const card = new Card(cardElement as HTMLElement, product, {
			onClick: () => {
				dataModel.emit('item:openPreview', product);
			}
		});
		card.render();
		return cardElement;
	});
});

dataModel.on('item:openPreview', (product: IBaseItem) => {
	const previewElement = cardPreviewTemplate.content.cloneNode(
		true
	) as HTMLElement;

	const cardPreview = new CardPreview(
		previewElement as HTMLElement,
		product,
		dataModel
	);

	modal.content = cardPreview.render();
	modal.open();
});

dataModel.on('addToBasket', (product: IBasketItem) => {
	dataModel.addToBasket(product);
	modal.close();
});

function renderBasketItems() {
	const basketCounter = document.querySelector(
		'.header__basket-counter'
	) as HTMLElement;
	if (basketCounter) {
		basketCounter.textContent = String(dataModel.basketCount);
	}

	const basketItems = dataModel.basket.map((item, index) => {
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
				const basketItem = new BasketItem(basketItemElement, item, {
					onClick: () => {
						dataModel.removeFromBasket(item.id);
					},
				});
				basketItem.index = String(index + 1);
				return basketItem.render();
			}
		}
		return document.createElement('div');
	})
	basket.items = basketItems as HTMLElement[];

	basket.total = dataModel.basketTotal;
	basket.render();
}

dataModel.on('basket:changed', renderBasketItems);

dataModel.on('orderForm: open', openOrderForm)

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

dataModel.on('basket:open', () => {
	renderBasketItems();
 	modal.content = basket.render();
 	modal.open();
 });

document.addEventListener('DOMContentLoaded', () => {
	loadProducts();
});