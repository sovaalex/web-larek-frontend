import { Card } from './Card';
import { IBaseItem } from '../types';
import { AppDataModel } from './DataModel';

export class CardPreview extends Card {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _dataModel: AppDataModel;

	constructor(container: HTMLElement, product: IBaseItem, dataModel: AppDataModel) {	
		const cardElement = container.querySelector('.card') as HTMLElement || container;
		super(cardElement, product, undefined);

		this._description = this.container.querySelector('.card__text') as HTMLElement;
		this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
		this._dataModel = dataModel; 

		if (this._dataModel.basket.some(item => item.id === product.id)) {
			this.setDisabled(this._button, true)
		} else {
			this._button.addEventListener('click', () => {
				this._dataModel.emit('addToBasket', product);
			});
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

	render() {
		super.render();
		this.description = this.card.description;
		return this.container;
	}
}
