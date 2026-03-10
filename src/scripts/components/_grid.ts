import IFile from '../models/IFile';
import { FileExtension } from '../models/FileExtension';
import IFolder from '../models/IFolder';
import { loadExplorer } from '../utilities/_storage';
import {
    getCurrentFolder,
    getFolderPath,
} from '../utilities/_helper';
import { ExplorerItemType } from '../models/ExplorerItemType';

function getItemIcon(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    const itemIconMap: Record<'folder' | FileExtension, string> = {
        folder: 'glyphs:folder-duo',
        xlsx: 'vscode-icons:file-type-excel',
        docs: 'vscode-icons:file-type-word',
        pptx: 'vscode-icons:file-type-powerpoint2',
    };

    if (type === 'folder') {
        return itemIconMap[type];
    }

    return itemIconMap[(data as IFile).extension];
}

function renderRow(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    return `<tr data-item-name="${data.name}" data-item-type="${type}">
                <td class="align-middle">
                    <div class="d-flex justify-content-center">
                        <input class="form-check-input opacity-0" type="checkbox" value="${data.name}">
                    </div>
                </td>
                <td class="align-middle" data-label="File Type">
                    <div class="d-flex align-items-center justify-content-end">
                        <iconify-icon icon="${getItemIcon(data, type)}" class="fs-4"></iconify-icon>
                    </div>
                </td>
                <td class="align-middle" data-label="Name">
                    ${
                        // show glimmer if the item is a file
                        type === 'file'
                            ? `<div class="position-relative d-inline-block explorer-item">
                                <iconify-icon icon="tabler:loader-quarter" class="fs-5 text-pink position-absolute -top-1 -left-2">
                                </iconify-icon>

                                ${data.name}
                            </div>`
                            : `<span class="explorer-item">${data.name}</span>`
                    }
                </td>
                <td data-label="Modified" class="text-secondary align-middle">
                    ${data.modified}
                </td>
                <td data-label="Modified By" class="text-secondary align-middle">
                    ${data.modifiedBy}
                </td>
                <td class="align-middle">
                    <div class="d-flex justify-content-end">
                        <div class="explorer-actions d-none gap-2">
                            <button class="btn btn-sm d-flex align-items-center" data-action="update">
                                <iconify-icon icon="mi:pen" class="fs-5 text-success">
                                </iconify-icon>
                            </button>
                            <button class="btn btn-sm d-flex align-items-center" data-action="delete">
                                <iconify-icon icon="si:bin-line" class="fs-5 text-danger">
                                </iconify-icon>
                            </button>
                        </div>
                    </div>
                </td>
            </tr>`;
}

function renderCustomTableMessage(content: string): string {
    const colCount =
        document.querySelectorAll('thead th').length || 6;

    return `<tr>
                <td colspan="${colCount}">
                    <div class="d-flex justify-content-center align-items-center my-4">
                        ${content}
                    </div>
                </td>
            </tr>`;
}

function renderTableData() {
    const explorer = loadExplorer();
    const data = getCurrentFolder(explorer);

    const tableBody = document.querySelector('.table-body');
    if (!tableBody) return;

    // mock loading state with spinner
    tableBody.innerHTML = renderCustomTableMessage(`
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `);

    // mock loading state
    setTimeout(() => {
        if (data === null) {
            tableBody.innerHTML = renderCustomTableMessage(
                `<span>Folder not found</span>`,
            );
            return;
        }

        if (data.files.length === 0 && data.subFolders.length === 0) {
            tableBody.innerHTML = renderCustomTableMessage(
                `<span>This folder is empty</span>`,
            );
            return;
        }

        tableBody.innerHTML = [
            ...data.subFolders.map((data) =>
                renderRow(data, 'folder'),
            ),
            ...data.files.map((data) => renderRow(data, 'file')),
        ].join('');
    }, 1000);
}

function renderBreadcrumb() {
    const container = document.querySelector('.breadcrumb');

    if (!container) return;

    const folderPath = getFolderPath();

    let accumulatedPath = '';

    let html = `<li class="breadcrumb-item fs-3">
                    <button class="btn fs-3 border-0" data-folder-path="">Documents</button>
                </li>`;
    html += folderPath
        .map((folderName, index) => {
            accumulatedPath += (index === 0 ? '' : '/') + folderName;
            const isLast = index === folderPath.length - 1;

            return `<li class="breadcrumb-item fs-3 d-inline-flex align-items-center ${isLast ? 'active' : ''}">
                        <button class="btn fs-3 border-0" data-folder-path="${accumulatedPath}">${folderName}</button>
                    </li>`;
        })
        .join('');

    container.innerHTML = html;
}

const renderGrid = () => {
    // TODO: implement code to Render grid
    renderTableData();
    renderBreadcrumb();
};

export default renderGrid;
