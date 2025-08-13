import { EventEmitter } from './base/events';

export interface IModal {
    content: HTMLElement;
    open(): void;
    close(): void;
    setContent(content: HTMLElement): void;
    getContent(): HTMLElement;
}

export class Modal implements IModal {
    protected _events: EventEmitter;
    protected _container: HTMLElement;
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _modalContainer: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        this._events = events;
        this._container = container;
        
        this._closeButton = this._container.querySelector('.modal__close') as HTMLButtonElement;
        this._content = this._container.querySelector('.modal__content') as HTMLElement;
        this._modalContainer = this._container.querySelector('.modal__container') as HTMLElement;
        
        this._initEventListeners();
    }

    setContent(content: HTMLElement): void {
        if (this._content) {
            this._content.innerHTML = '';
            if (content) {
                this._content.appendChild(content);
            }
        }
    }

    getContent(): HTMLElement {
        return this._content;
    }

    set content(value: HTMLElement) {
        this.setContent(value);
    }

    get content(): HTMLElement {
        return this.getContent();
    }

    open(): void {
        this._container.classList.add('modal_active');
        this._events.emit('modal:open');
    }

    close(): void {
        this._container.classList.remove('modal_active');
        this._events.emit('modal:close');
        this.setContent(null);
    }

    isOpen(): boolean {
        return this._container.classList.contains('modal_active');
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
}
