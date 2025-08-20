import { Card } from './Card';
import { IBaseItem, ICardActions } from '../types';

export class CardPreview extends Card {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, product: IBaseItem, actions?: ICardActions) {
        super(container, product);

        this._description = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
        
        if (actions?.onClick) {
            this._button?.addEventListener('click', actions.onClick);
        }
        
        this.render();
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
