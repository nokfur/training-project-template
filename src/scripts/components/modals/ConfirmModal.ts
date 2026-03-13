import { BaseModal } from './BaseModal';

export class ConfirmModal extends BaseModal {
    private messageEl!: HTMLElement;
    private okBtn!: HTMLButtonElement;

    private callback?: () => Promise<void>;

    protected template(): string {
        return `
        <div class="modal fade">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title">Confirm</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <p class="confirm-message"></p>
              </div>

              <div class="modal-footer">
                <button class="btn btn-secondary" data-bs-dismiss="modal">
                    Cancel
                </button>
                <button class="btn btn-danger confirm-ok">
                    OK
                </button>
              </div>

            </div>
          </div>
        </div>
        `;
    }

    protected bindEvents() {
        this.messageEl = this.element.querySelector(
            '.confirm-message',
        )!;
        this.okBtn = this.element.querySelector('.confirm-ok')!;

        this.okBtn.addEventListener('click', () => {
            this.callback?.()
                .then(() => this.hide())
                .catch((err) => alert(err.message));
        });
    }

    confirm(message: string, callback: () => Promise<void>) {
        this.messageEl.textContent = message;
        this.callback = callback;

        this.show();
    }
}
