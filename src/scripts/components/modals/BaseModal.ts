const { Modal } = require('bootstrap');

export abstract class BaseModal {
    protected element: HTMLElement; // the modal element created from the template of the subclass
    private modal: any; // bootstrap Modal type, have many functions like: show, hide, dispose, etc.

    constructor() {
        // create temporary wrapper and set innerHTML to the template gotten from the subclass
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template().trim();

        // element will point to the first child of the wrapper, which is the actual modal element from subclass
        this.element = wrapper.firstElementChild as HTMLElement;

        // append modal to the body DOM
        document.body.insertAdjacentElement(
            'beforeend',
            this.element,
        );

        // create bootstrap modal instance with the modal element
        this.modal = new Modal(this.element);

        // Remove modal from DOM after it closes
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
