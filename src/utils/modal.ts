type ModalOptions = {
    templateId: string;
    data: Record<string, any>;
};

export class Modal {
    static openModal(options: ModalOptions) {
        const template = document.getElementById(options.templateId) as HTMLTemplateElement;
        if (!template) {
            throw new Error(`Template with id "${options.templateId}" not found`);
        }
        const modal = template.content.firstElementChild!.cloneNode(true) as HTMLElement;

        for (const [key, value] of Object.entries(options.data)) {
            const elem = modal.querySelector(`.${key}`) as HTMLElement | null;
            if (elem) {
                if (elem instanceof HTMLImageElement) {
                    elem.src = value;
                    elem.alt = options.data['title'] || '';
                } else {
                    elem.textContent = value;
                }
            }
        }

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
            contentContainer.appendChild(modal);
        }

        document.body.appendChild(overlay);

        overlay.classList.add('modal_active');

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                Modal.closeModal();
            }
        });

        const closeButton = overlay.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                Modal.closeModal();
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
