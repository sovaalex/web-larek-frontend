import { Component } from './base/component';
import { ISuccess } from '../types';
import { AppDataModel } from './DataModel';

export class Success extends Component<ISuccess> {
	protected _button: HTMLButtonElement;
	protected _label: HTMLParagraphElement;
	protected _callback: () => void;

	constructor(container: HTMLElement, dataModel: AppDataModel) {
		super(container);
		this._button = container.querySelector<HTMLButtonElement>('button');
		this._label = container.querySelector<HTMLParagraphElement>('p');

		if (dataModel.orderSuccess && dataModel.orderSuccess.total !== undefined) {
			this._label.innerHTML = `Списано ${dataModel.orderSuccess.total} синапсов`;
		} else {
			this._label.innerHTML = 'Заказ успешно оформлен';
		}
		
		this._button.addEventListener('click', () => {
			if (typeof this._callback === 'function') {
				this._callback();
			}
		});
	}

	set callback(callback: () => void) {
		this._callback = callback;
	}
}
