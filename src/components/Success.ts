import { EventEmitter } from './base/events';

export interface ISuccessTemplate {
    open(): void;
    close(): void;
    setContent(title: string, description?: string): void;
}

export class Success implements ISuccessTemplate {
    protected _events: EventEmitter;
    protected _container: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected _titleElement: HTMLElement;
    protected _descriptionElement: HTMLElement;
    protected _modalContainer: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._events = events;
        this._container = container;
        
        this._closeButton = this._container.querySelector('.order-success__close') as HTMLButtonElement;
        this._titleElement = this._container.querySelector('.order-success__title') as HTMLElement;
        this._descriptionElement = this._container.querySelector('.order-success__description') as HTMLElement;
        this._modalContainer = this._container.querySelector('.modal__container') as HTMLElement;
        
        this._initEventListeners();
    }

    setContent(title: string, description?: string): void {
        if (this._titleElement) {
            this._titleElement.textContent = title;
        }
        
        if (this._descriptionElement && description) {
            this._descriptionElement.textContent = description;
            this._descriptionElement.style.display = 'block';
        } else if (this._descriptionElement) {
            this._descriptionElement.style.display = 'none';
        }
    }

    open(): void {
        this._container.classList.add('modal_active');
        this._events.emit('success:open');
    }

    close(): void {
        this._container.classList.remove('modal_active');
        this._events.emit('success:close');
    }

    protected _initEventListeners(): void {
        if (this._closeButton) {
            this._closeButton.addEventListener('click', () => this.close());
        }

        this._container.addEventListener('click', (event) => {
            if (event.target === this._container) {
                this.close();
            }
        });

        if (this._modalContainer) {
            this._modalContainer.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }
    }

    render(): HTMLElement {
        const successContent = document.querySelector('#success') as HTMLTemplateElement;
        const content = successContent.content.cloneNode(true) as HTMLElement;
        const successElement = content.querySelector('.order-success') as HTMLElement;
        
        this._titleElement = successElement.querySelector('.order-success__title') as HTMLElement;
        this._descriptionElement = successElement.querySelector('.order-success__description') as HTMLElement;
        this._closeButton = successElement.querySelector('.order-success__close') as HTMLButtonElement;
        
        this._initEventListeners();
        
        return successElement;
    }
}
