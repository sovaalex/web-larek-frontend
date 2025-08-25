import { Component } from './base/component';
import { ISuccess } from '../types';
import { AppDataModel } from './DataModel';

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _description: HTMLParagraphElement;
	protected _title: HTMLHeadingElement;
	protected _callback: () => void;

	constructor(container: HTMLElement, dataModel: AppDataModel) {
		super(container);
		this._button = container.querySelector<HTMLButtonElement>('.order-success__close');
		this._description = container.querySelector<HTMLParagraphElement>('.order-success__description');
		this._title = container.querySelector<HTMLHeadingElement>('.order-success__title');

		this.updateContent(dataModel);
		
		this._button.addEventListener('click', () => {
			if (typeof this._callback === 'function') {
				this._callback();
			}
		});
	}

	private updateContent(dataModel: AppDataModel) {
		if (dataModel.orderSuccess) {
			this._description.textContent = `Списано ${dataModel.basketTotal} синапсов`;
		} 
	}

	set callback(callback: () => void) {
		this._callback = callback;
	}

	render(data?: Partial<ISuccess>): HTMLElement {
		Object.assign(this as any, data);
		this.updateContent
		return this.container;
	}
}
