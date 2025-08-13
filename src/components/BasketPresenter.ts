import { EventEmitter } from './base/events';
import { Basket, IBasket, IBasketItem } from './Basket';
import { IPage } from './Page';

export interface IBasketPresenter {
    init(): void;
    openBasket(): void;
    updateBasketCount(count: number): void;
    handleAddToBasket(item: IBasketItem): void;
    handleRemoveFromBasket(itemId: string): void;
    handleUpdateQuantity(itemId: string, quantity: number): void;
    getBasketState(): { items: IBasketItem[], total: number };
}

export class BasketPresenter implements IBasketPresenter {
    protected _events: EventEmitter;
    protected _basket: IBasket;
    protected _page: IPage;

    constructor(events: EventEmitter, basket: IBasket, page: IPage) {
        this._events = events;
        this._basket = basket;
        this._page = page;
    }

    init(): void {
        this._events.on('basket:open', () => {
            this.openBasket();
        });

        this._events.on('basket:add', (data: { item: IBasketItem }) => {
            this.handleAddToBasket(data.item);
        });

        this._events.on('basket:remove', (data: { itemId: string }) => {
            this.handleRemoveFromBasket(data.itemId);
        });

        this._events.on('basket:updateQuantity', (data: { itemId: string, quantity: number }) => {
            this.handleUpdateQuantity(data.itemId, data.quantity);
        });

        this._events.on('basket:changed', () => {
            this.updateBasketCount(this._basket.getItemCount());
        });
    }

    openBasket(): void {
        this._page.toggleScroll(true);
        this._events.emit('modal:open', { modal: 'basket' });
    }

    updateBasketCount(count: number): void {
        this._page.setBasketCounter(count);
    }

    handleAddToBasket(item: IBasketItem): void {
        this._basket.addItem(item);
    }

    handleRemoveFromBasket(itemId: string): void {
        this._basket.removeItem(itemId);
    }

    handleUpdateQuantity(itemId: string, quantity: number): void {
        this._basket.updateQuantity(itemId, quantity);
    }

    getBasketState(): { items: IBasketItem[], total: number } {
        return {
            items: this._basket.items,
            total: this._basket.total
        };
    }

    getTotalItemsCount(): number {
        return this._basket.getItemCount();
    }

    getTotalPrice(): number {
        return this._basket.getTotal();
    }
}
