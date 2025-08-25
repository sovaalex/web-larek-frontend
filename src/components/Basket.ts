import { IBasket } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { AppDataModel } from './DataModel';

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _dataModel: AppDataModel

	constructor(container: HTMLElement, dataModel: AppDataModel) {
		super(container);

		this._dataModel = dataModel
		this._items = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this._button.addEventListener('click', () => {
			this._dataModel.emit('orderForm: open');
		});
	}

	set items(items: HTMLElement[]) {
		this._items.replaceChildren(...items);
	}

	set total(value: number) {
		this._price.textContent = `${value} синапсов`;
	}

	render(): HTMLElement {
		if (this._items.children.length === 0) {
			const emptyMessage = document.createElement('p');
			emptyMessage.textContent = 'Корзина пуста';
			emptyMessage.className = 'basket_empty';
			this._items.appendChild(emptyMessage);
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}

		return this.container;
	}
}
