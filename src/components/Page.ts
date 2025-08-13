import { EventEmitter } from './base/events';

export interface IPage {
    basketCounter: number;
    catalogContainer: HTMLElement;
    toggleScroll(lock: boolean): void;
    clearCatalog(): void;
    appendToCatalog(element: HTMLElement): void;
    setBasketCounter(count: number): void;
    getBasketCounter(): number;
    setItems(items: any[]): void;
    getItemById(id: string): any;
}

export class Page implements IPage {
    protected _events: EventEmitter;
    protected _container: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _catalogContainer: HTMLElement;
    protected _items: any[] = [];

    constructor(container: HTMLElement, events: EventEmitter) {
        this._events = events;
        this._container = container;

        this._basketCounter = this._container.querySelector('.header__basket-counter') as HTMLElement;
        this._catalogContainer = this._container.querySelector('.gallery') as HTMLElement;
        
        this._initEventListeners();
    }

    setBasketCounter(count: number): void {
        if (this._basketCounter) {
            this._basketCounter.textContent = String(count);
        }
    }

    getBasketCounter(): number {
        return this._basketCounter ? parseInt(this._basketCounter.textContent || '0') : 0;
    }

    set basketCounter(value: number) {
        this.setBasketCounter(value);
    }

    get basketCounter(): number {
        return this.getBasketCounter();
    }

    get catalogContainer(): HTMLElement {
        return this._catalogContainer;
    }

    toggleScroll(lock: boolean) {
        this._container.classList.toggle('page_locked', lock);
    }

    protected _initEventListeners() {
        const basketButton = this._container.querySelector('.header__basket');
        if (basketButton) {
            basketButton.addEventListener('click', () => {
                this._events.emit('basket:open');
            });
        }

        this._events.on('basket:count:update', (data: { count: number }) => {
            this.setBasketCounter(data.count);
        });
    }

    clearCatalog() {
        if (this._catalogContainer) {
            this._catalogContainer.innerHTML = '';
        }
    }

    appendToCatalog(element: HTMLElement) {
        if (this._catalogContainer) {
            this._catalogContainer.append(element);
        }
    }

    setItems(items: any[]) {
        this._items = items;
    }

    getItemById(id: string) {
        return this._items.find(item => item.id === id);
    }
}
