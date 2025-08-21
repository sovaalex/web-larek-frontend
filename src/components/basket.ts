import { IBasketItem, IBasket } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _list: IBasketItem[] = [];

	constructor(container: HTMLElement) {
		super(container);

		this._items = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);
	}

	set items(items: IBasketItem[]) {
		this._list = items;
	}

	get items(): IBasketItem[] {
		return this._list;
	}

	get total(): number {
		return this._list.reduce(
			(sum, item) => sum + (item.price || 0) * item.quantity,
			0
		);
	}

	add(item: IBasketItem) {
		this._list.push(item);
	}

	remove(itemId: string) {
		this._list = this._list.filter((item) => item.id !== itemId);
	}

	clear() {
		this._list = [];
	}

	get itemsElement(): HTMLElement {
		return this._items;
	}

	get priceElement(): HTMLElement {
		return this._price;
	}

	get buttonElement(): HTMLButtonElement {
		return this._button;
	}
}
