import { IBasketItem, IClick } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

export class BasketItem extends Component<IBasketItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IClick) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._index = ensureElement<HTMLElement>('.basket__item-index', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			container
		);

		if (actions?.onClick) {
			this._button.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	get index(): string {
		return this._index.textContent || '';
	}

	render() {
		return this.container;
	}
}
