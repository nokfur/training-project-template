import { ExplorerItemType } from '../models/ExplorerItemType';
import { FileExtension } from '../models/FileExtension';
import IFile from '../models/IFile';
import IFolder from '../models/IFolder';
import { Helper } from '../utilities/_helper';
import { StorageService } from '../utilities/services/StorageService';

function getItemIcon(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    const itemIconMap: Record<'folder' | FileExtension, string> = {
        folder: 'glyphs:folder-duo',
        xlsx: 'vscode-icons:file-type-excel',
        docs: 'vscode-icons:file-type-word',
        pptx: 'vscode-icons:file-type-powerpoint2',
        txt: 'icon-park-outline:file-txt-one',
    };

    if (type === 'folder') {
        return itemIconMap[type];
    }

    return itemIconMap[(data as IFile).extension];
}

function renderItemName(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    return data.isGlimmer
        ? `<div class="position-relative d-inline-block explorer-item" data-item-id="${data.id}" data-item-name="${data.name}" data-item-type="${type}">
                <iconify-icon icon="tabler:loader-quarter" class="fs-5 text-pink position-absolute -top-1 -left-2">
                </iconify-icon>

                ${data.name}
            </div>`
        : `<div class="d-inline-block explorer-item" data-item-id="${data.id}" data-item-name="${data.name}" data-item-type="${type}">${data.name}</div>`;
}

function renderRow(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    return `<tr class="table-row ">
                <td class="align-middle">
                    <div class="d-flex justify-content-center">
                        <input class="form-check-input opacity-0" type="checkbox">
                    </div>
                </td>
                <td class="align-middle" data-label="File Type">
                    <div class="d-flex align-items-center justify-content-end">
                        <iconify-icon icon="${getItemIcon(data, type)}" class="fs-4"></iconify-icon>
                    </div>
                </td>
                <td class="align-middle" data-label="Name">
                    ${renderItemName(data, type)}
                </td>
                <td data-label="Modified" class="text-secondary align-middle">
                    ${Helper.formatDate(data.modifiedAt)}
                </td>
                <td data-label="Modified By" class="text-secondary align-middle">
                    ${data.modifiedBy}
                </td>
                <td class="align-middle">
                    <div class="d-flex justify-content-end">
                        <div class="explorer-actions d-inline-flex invisible gap-2">
                            <button class="btn btn-sm d-flex align-items-center btn-item-update" 
                                    data-item-id="${data.id}" data-item-type="${type}">
                                <iconify-icon icon="mi:pen" class="fs-5 text-success">
                                </iconify-icon>
                            </button>
                            <button class="btn btn-sm d-flex align-items-center btn-item-delete" 
                                    data-item-id="${data.id}" data-item-type="${type}">
                                <iconify-icon icon="si:bin-line" class="fs-5 text-danger">
                                </iconify-icon>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function renderCustomRowMessage(content: string): string {
    const colCount =
        document.querySelectorAll('thead th').length || 6;

    return `<tr>
                <td colspan="${colCount}" class="custom-row">
                    <div class="d-flex justify-content-center align-items-center my-4">
                        ${content}
                    </div>
                </td>
            </tr>`;
}

const renderTableData = async () => {
    const explorer = StorageService.loadExplorer();
    const data = Helper.getCurrentFolder(explorer);

    const tableBody = document.querySelector('.table-body');
    if (!tableBody) return;

    // mock loading state with spinner
    tableBody.innerHTML = renderCustomRowMessage(`
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `);

    // mock loading time
    await Helper.delay(500);

    if (data === null) {
        tableBody.innerHTML = renderCustomRowMessage(
            `<span>Folder not found</span>`,
        );
        return;
    }

    if (data.files.length === 0 && data.subFolders.length === 0) {
        tableBody.innerHTML = renderCustomRowMessage(
            `<span>This folder is empty</span>`,
        );
        return;
    }

    tableBody.innerHTML = [
        ...data.subFolders.map((data) => renderRow(data, 'folder')),
        ...data.files.map((data) => renderRow(data, 'file')),
    ].join('');
};

export default renderTableData;
