import { BaseModal } from './BaseModal';

export class InputModal extends BaseModal {
    private messageEl!: HTMLElement;
    private inputEl!: HTMLInputElement;
    private okBtn!: HTMLButtonElement;

    private callback?: (value: string) => void;

    protected template(): string {
        return `
        <div class="modal fade">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title">Input</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <p class="input-message"></p>

                <input 
                    type="text"
                    class="form-control input-field"
                />

                <div class="text-danger small mt-2 input-error d-none">
                    Value cannot be empty
                </div>
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button class="btn btn-primary input-ok">
                    OK
                </button>
              </div>

            </div>
          </div>
        </div>
        `;
    }

    protected bindEvents() {
        this.messageEl =
            this.element.querySelector('.input-message')!;
        this.inputEl = this.element.querySelector('.input-field')!;
        this.okBtn = this.element.querySelector('.input-ok')!;
        const errorEl = this.element.querySelector('.input-error')!;

        this.okBtn.addEventListener('click', () => {
            const value = this.inputEl.value.trim();

            if (!value) {
                errorEl.classList.remove('d-none');
                this.inputEl.focus();
                return;
            }

            this.callback?.(value);
            this.hide();
        });

        // remove error when typing
        this.inputEl.addEventListener('input', () => {
            errorEl.classList.add('d-none');
        });

        // Enter key submits
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.okBtn.click();
            }
        });
    }

    prompt(
        message: string,
        callback: (value: string) => void,
        defaultValue = '',
    ) {
        this.messageEl.textContent = message;
        this.inputEl.value = defaultValue;
        this.callback = callback;

        this.show();

        setTimeout(() => {
            this.inputEl.focus();
        }, 100);
    }
}
