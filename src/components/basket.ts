import { IBaseItem, IBasketView } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<IBasketView> {
    protected _items: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _list: IBaseItem[] = [];

    constructor(container: HTMLElement) {
        super(container);
        
        this._items = ensureElement<HTMLElement>('.basket__list', container);
        this._price = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
    }

    set items(items: IBaseItem[]) {
        this._list = items;
        this.render();
    }

    get items(): IBaseItem[] {
        return this._list;
    }

    get total(): number {
        return this._list.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    add(item: IBaseItem) {
        this._list.push(item);
        this.render();
    }

    remove(itemId: string) {
        this._list = this._list.filter(item => item.id !== itemId);
        this.render();
    }

    clear() {
        this._list = [];
        this.render();
    }
}
