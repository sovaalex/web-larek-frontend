import { EventEmitter } from './base/events';

export interface IBasketItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

export interface IBasket {
    items: IBasketItem[];
    total: number;
    addItem(item: IBasketItem): void;
    removeItem(id: string): void;
    updateQuantity(id: string, quantity: number): void;
    clear(): void;
    getTotal(): number;
    getItemCount(): number;
}

export class Basket implements IBasket {
    protected _events: EventEmitter;
    protected _items: IBasketItem[] = [];
    protected _container: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._events = events;
        this._container = container;
    }

    get items(): IBasketItem[] {
        return [...this._items];
    }

    get total(): number {
        return this.getTotal();
    }

    addItem(item: IBasketItem): void {
        const existingItem = this._items.find(i => i.id === item.id);

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        
        const newItem = {
            ...item,
            price: price,
            quantity: quantity
        };
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this._items.push(newItem);
        }

        this._events.emit('basket:changed', { items: this._items, total: this.total });
    }

    removeItem(id: string): void {        
        this._items = this._items.filter(item => item.id !== id);      
        this._events.emit('basket:changed', { items: this._items, total: this.total });
    }

    updateQuantity(id: string, quantity: number): void {
        const item = this._items.find(i => i.id === id);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = quantity;
                this._events.emit('basket:changed', { items: this._items, total: this.total });
            }
        }
    }

    clear(): void {
        this._items = [];
        this._container.innerHTML = '';
        this._events.emit('basket:changed', { items: this._items, total: 0 });
    }

    getTotal(): number {
        const total = this._items.reduce((sum, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return sum + (price * quantity);
        }, 0);
        return total;
    }

    getItemCount(): number {
        const count = this._items.reduce((sum, item) => {
            const quantity = Number(item.quantity) || 0;
            return sum + quantity;
        }, 0);
        return count;
    }

    hasItem(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    getItem(id: string): IBasketItem | undefined {
        return this._items.find(item => item.id === id);
    }
}
