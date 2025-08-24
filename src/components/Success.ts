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
		this._label.innerHTML = `Списано ${dataModel.orderSuccess.total} синапсов`;
		
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
