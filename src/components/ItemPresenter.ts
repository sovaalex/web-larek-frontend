import { EventEmitter } from './base/events';
import { IPage } from './Page';
import { Item, IViewItem } from './Item';
import { CATEGORY_STYLES } from '../utils/constants';

export interface IItemPresenter {
    init(): void;
    displayItems(items: any[]): void;
    createItem(item: any): IViewItem;
}

export class ItemPresenter implements IItemPresenter {
    protected _events: EventEmitter;
    protected _page: IPage;
    protected _itemTemplate: HTMLTemplateElement;

    constructor(
        events: EventEmitter,
        page: IPage,
        itemTemplate: HTMLTemplateElement,
        protected _modal: any,
        protected _cardPreviewTemplate: HTMLTemplateElement
    ) {
        this._events = events;
        this._page = page;
        this._itemTemplate = itemTemplate;
    }

    init(): void {
        this._events.on('item:openPreview', (data: { id: string }) => {
            this.handleItemPreview(data.id);
        });

        this._events.on('items:loaded', (data: { items: any[] }) => {
            this.displayItems(data.items);
        });
    }

    handleItemPreview(itemId: string): void {
        const item = this._page.getItemById(itemId);
        if (!item) {
            console.error('[DEBUG] Item not found:', itemId);
            return;
        }

        const content = this._cardPreviewTemplate.content.cloneNode(true) as HTMLElement;
        const card = content.querySelector('.card') as HTMLElement;
        
        const image = card.querySelector('.card__image') as HTMLImageElement;
        const title = card.querySelector('.card__title') as HTMLElement;
        const category = card.querySelector('.card__category') as HTMLElement;
        const text = card.querySelector('.card__text') as HTMLElement;
        const price = card.querySelector('.card__price') as HTMLElement;
        const addButton = card.querySelector('.card__button') as HTMLButtonElement;

        image.src = item.image || '';
        title.textContent = item.title || '';
        category.textContent = item.category || '';
        const categoryStyle = CATEGORY_STYLES[item.category || 'другое'] || 'other';
        category.className = `card__category card__category_${categoryStyle}`;
        text.textContent = item.description || '';
        price.textContent = `${item.price || 0} синапсов`;

        addButton.addEventListener('click', () => {
            this._events.emit('basket:add', { item });
            this._modal.close();
        });

        this._modal.setContent(card);
        this._modal.open();
    }

    displayItems(items: any[]): void {
        this._page.clearCatalog();
        this._page.setItems(items);
        items.forEach(item => {
            const itemView = this.createItem(item);
            const itemElement = itemView.render(item);
            this._page.appendToCatalog(itemElement);
        });
    }

    createItem(item: any): IViewItem {
        return new Item(this._itemTemplate, this._events);
    }
}
