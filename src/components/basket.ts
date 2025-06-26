export interface BasketItem {
    productId: string;
    title?: string;
    quantity: number;
    price: number;
}

export class Basket {
    private items: BasketItem[] = [];
    private listeners: Array<() => void> = [];

    addItem(item: BasketItem) {
        const existingItem = this.items.find(i => i.productId === item.productId);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        this.notify();
    }

    removeItem(productId: string) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.notify();
    }

    clearItems() {
        this.items = [];
        this.notify();
    }

    getItems() {
        return [...this.items];
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(listener => listener());
    }
}

export const basket = new Basket();