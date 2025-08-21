import { IBaseItem, IClick } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { CATEGORY_STYLES } from '../utils/constants';

export class Card extends Component<IBaseItem> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description?: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(
		container: HTMLElement,
		protected card: IBaseItem,
		actions?: IClick
	) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._description = container.querySelector('.card__text') as HTMLElement;
		this._button = container.querySelector(
			'.card__button'
		) as HTMLButtonElement;
		this._index = container.querySelector('.basket__item-index') as HTMLElement;

		if (actions) {
			this.container.addEventListener('click', (event: MouseEvent) => {
				if (actions.onClick) {
					actions.onClick(event);
				}
			});
		}

		this.render();
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

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);

		Object.values(CATEGORY_STYLES).forEach((style) => {
			this._category.classList.remove(`card__category_${style}`);
		});

		if (CATEGORY_STYLES[value]) {
			this._category.classList.add(`card__category_${CATEGORY_STYLES[value]}`);
		}
	}

	set price(value: number | null) {
		if (value !== null) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			if (this._button) {
				this.setDisabled(this._button, true);
			}
		}
	}

	set description(value: string) {
		if (this._description) {
			this.setText(this._description, value);
		}
	}

	set buttonText(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	set index(value: string) {
		if (this._index) {
			this.setText(this._index, value);
		}
	}

	get index(): string {
		return this._index?.textContent || '';
	}

	render() {
		this.id = this.card.id;
		this.title = this.card.title;
		this.image = this.card.image;
		this.category = this.card.category;
		this.price = this.card.price;
		this.description = this.card.description || '';
		return this.container;
	}
}
