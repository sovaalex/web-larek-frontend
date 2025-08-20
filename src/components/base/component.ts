export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    protected setVisible(element: HTMLElement) {
        element.style.display = 'block';
    }

    protected setClass(element: HTMLElement, className: string, add: boolean = true) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as any, data);
        return this.container;
    }
}
