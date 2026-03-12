const { Modal } = require('bootstrap');

export abstract class BaseModal {
    protected element: HTMLElement;
    private modal: any;

    constructor() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template().trim();

        this.element = wrapper.firstElementChild as HTMLElement;

        document.body.insertAdjacentElement(
            'beforeend',
            this.element,
        );

        this.modal = new Modal(this.element);

        // Remove modal after it closes
        this.element.addEventListener('hidden.bs.modal', () => {
            this.destroy();
        });

        this.bindEvents();
    }

    protected abstract template(): string;

    protected abstract bindEvents(): void;

    protected show() {
        this.modal.show();
    }

    protected hide() {
        this.modal.hide();
    }

    private destroy() {
        this.modal.dispose(); // remove bootstrap instance
        this.element.remove(); // remove DOM
    }
}
