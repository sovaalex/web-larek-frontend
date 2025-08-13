import { IProduct } from "../types";
import { EventEmitter } from "./base/events";
import { CATEGORY_STYLES } from "../utils/constants";

export interface IViewItem {
    id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    description: string;
    render(product: IProduct): HTMLElement;
}

export class Item implements IViewItem {
    protected itemElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected addButton: HTMLButtonElement;
    protected _id: string;
    protected _events: EventEmitter;

    constructor(template: HTMLTemplateElement, events: EventEmitter) {
        this._events = events;
        if (!template || !template.content) {
            throw new Error('Template element or content not found');
        }
        
        const templateContent = template.content.cloneNode(true) as HTMLElement;
        this.itemElement = templateContent.querySelector('.card') as HTMLElement;
        
        if (!this.itemElement) {
            throw new Error('Card element not found in template');
        }
        
        this.titleElement = this.itemElement.querySelector('.card__title') as HTMLElement;
        this.priceElement = this.itemElement.querySelector('.card__price') as HTMLElement;
        this.categoryElement = this.itemElement.querySelector('.card__category') as HTMLElement;
        this.imageElement = this.itemElement.querySelector('.card__image') as HTMLImageElement;
        this.descriptionElement = this.itemElement.querySelector('.card__text') as HTMLElement;
        this.addButton = this.itemElement.querySelector('.card__button') as HTMLButtonElement;

        if (this.addButton) {
            this.addButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this._events.emit('item:addToBasket', { id: this._id });
            });
        }

        this.itemElement.addEventListener('click', () => {
            this._events.emit('item:openPreview', { id: this._id });
        });
    }

    set id(value: string) {
        this._id = value;
    }

    set title(value: string) {
        if (this.titleElement) this.titleElement.textContent = value;
    }

    set price(value: number) {
        if (this.priceElement) {
            this.priceElement.textContent = value === null || value === undefined ? 'бесценно' : `${value} синапсов`;
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            this.categoryElement.className = `card__category card__category_${this.getCategoryClass(value)}`;
        }
    }

    private getCategoryClass(category: string): string {
        return CATEGORY_STYLES[category] || 'other';
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
            this.imageElement.alt = this.title;
        }
    }

    set description(value: string) {
        if (this.descriptionElement) this.descriptionElement.textContent = value;
    }

    render(product: IProduct): HTMLElement {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.category = product.category;
        this.image = product.image;
        this.description = product.description;
        return this.itemElement;
    }
}
