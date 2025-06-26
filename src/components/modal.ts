import { IModalOptions } from '../types';

export class Modal {
    static openModal(options: IModalOptions) {
        const modal = this.createModalElement(options);
        this.fillModalData(modal, options.data);
        this.attachModal(modal);
        this.addEventListeners(modal);
    }

    private static createModalElement(options: IModalOptions): HTMLElement {
        const template = document.getElementById(options.templateId) as HTMLTemplateElement;
        if (!template) {
            throw new Error(`Template with id "${options.templateId}" not found`);
        }
        const modalContent = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        const overlay = document.createElement('div');
        overlay.classList.add('modal');
        overlay.innerHTML = `
            <div class="modal__container">
                <button class="modal__close" aria-label="закрыть"></button>
                <div class="modal__content"></div>
            </div>
        `;

        const contentContainer = overlay.querySelector('.modal__content');
        if (contentContainer) {
            contentContainer.appendChild(modalContent);
        }

        return overlay;
    }

    private static fillModalData(modal: HTMLElement, data: Record<string, any>) {
        for (const [key, value] of Object.entries(data)) {
            const elem = modal.querySelector(`.${key}`) as HTMLElement | null;
            if (elem) {
                if (elem instanceof HTMLImageElement) {
                    elem.src = value;
                    elem.alt = data['title'] || '';
                } else {
                    elem.textContent = value;
                }
            }
        }
    }

    private static attachModal(modal: HTMLElement) {
        document.body.appendChild(modal);
        modal.classList.add('modal_active');
    }

    private static addEventListeners(modal: HTMLElement) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.closeModal();
            }
        });

        const closeButton = modal.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }
    }

    static closeModal() {
        const overlays = document.querySelectorAll('.modal');
        overlays.forEach(overlay => {
            overlay.classList.remove('modal_active');
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });
    }
}
