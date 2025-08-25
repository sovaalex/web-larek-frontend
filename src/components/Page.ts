import { IPage } from '../types';
import { Component } from './base/component';
import { EventEmitter } from './base/events';

export class Page extends Component<IPage> {
	protected _itemCatalog: HTMLElement;
	protected _basketCounter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected events: EventEmitter;

	constructor(container: HTMLElement, events: EventEmitter) {
		super(container);
		this.events = events;

		this._itemCatalog = container.querySelector('.gallery') as HTMLElement;
		this._basketCounter = container.querySelector(
			'.header__basket-counter'
		) as HTMLElement;
		this._wrapper = container.querySelector('.page__wrapper') as HTMLElement;
		this._basket = container.querySelector('.header__basket') as HTMLElement;

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set basketCounter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._itemCatalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
