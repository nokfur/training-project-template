import IFile from '../models/IFile';
import { FileExtension } from '../models/FileExtension';
import IFolder from '../models/IFolder';
import { loadExplorer } from '../utilities/_storage';
import {
    getCurrentFolder,
    getFolderPath,
} from '../utilities/_helper';

type ExplorerItemType = 'file' | 'folder';

function getItemIcon(
    data: IFile | IFolder,
    type: ExplorerItemType,
): string {
    const itemIconMap: Record<'folder' | FileExtension, string> = {
        folder: 'glyphs:folder-duo',
        xlsx: 'vscode-icons:file-type-excel',
        docs: 'vscode-icons:file-type-doc',
        pptx: 'vscode-icons:file-type-ppt',
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
    return `<tr ${type === 'folder' ? `data-folder-name="${data.name}"` : ''}>
                <td data-label="File Type">
                    <div class="d-flex align-items-center justify-content-end h-100">
                        <iconify-icon icon="${getItemIcon(data, type)}" class="fs-4"></iconify-icon>
                    </div>
                </td>
                <td class="align-items-center" data-label="Name">
                    ${
                        // show glimmer if the item is a file
                        type === 'file'
                            ? `<div class="position-relative">
                                <iconify-icon icon="tabler:loader-quarter" class="fs-5 text-pink position-absolute -top-1 -left-2">
                                </iconify-icon>

                                ${data.name}
                            </div>`
                            : data.name
                    }
                </td>
                <td data-label="Modified" class="text-secondary">
                    ${data.modified}
                </td>
                <td data-label="Modified By" class="text-secondary">
                    ${data.modifiedBy}
                </td>
                <td></td>
            </tr>`;
}

function renderTableData() {
    const explorer = loadExplorer();
    const data = getCurrentFolder(explorer);

    const tableBody = document.querySelector('.table-body');
    if (!tableBody) return;

    // mock loading state with spinner
    tableBody.innerHTML = `<tr>
                                <td colspan="5">
                                    <div class="d-flex justify-content-center align-items-center my-4">
                                        <div class="spinner-border" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;

    // mock loading state
    setTimeout(() => {
        const html = [
            ...data.subFolders.map((data) =>
                renderRow(data, 'folder'),
            ),
            ...data.files.map((data) => renderRow(data, 'file')),
        ].join('');

        tableBody.innerHTML = html;
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
