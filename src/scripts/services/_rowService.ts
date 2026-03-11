import renderGrid from '../components/_grid';
import { ExplorerItemType } from '../models/ExplorerItemType';
import { FILE_EXTENSIONS } from '../models/FileExtension';
import {
    getCurrentFolder,
    getUniqueName,
    updateFolderPath,
} from '../utilities/_helper';
import { loadExplorer, saveExplorer } from '../utilities/_storage';

function handleRename(
    selectedItemName: string,
    itemType: ExplorerItemType,
) {
    let newName = prompt(
        `Enter new ${itemType} name:`,
        selectedItemName,
    ).trim();

    if (!newName || newName === selectedItemName) return;

    const explorer = loadExplorer();
    const currentFolder = getCurrentFolder(explorer);
    if (!currentFolder) return;

    if (itemType === 'folder') {
        const folder = currentFolder.subFolders.find(
            (f) => f.name === selectedItemName,
        );

        if (folder)
            folder.name = getUniqueName(
                currentFolder,
                newName,
                'folder',
            );
    }

    if (itemType === 'file') {
        const file = currentFolder.files.find(
            (f) => f.name === selectedItemName,
        );

        let newExt = file.extension;

        // if user changes file extension, validate it
        if (newName.includes('.')) {
            const parts = newName.split('.');
            const ext = parts[parts.length - 1];
            if (!FILE_EXTENSIONS.includes(ext)) {
                alert(
                    `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
                );
                return;
            }

            newExt = ext;
        } else newName += `.${file.extension}`; // keep old extension if user not input extension part

        if (newName === selectedItemName) return;

        file.name = getUniqueName(currentFolder, newName, 'file');
        file.extension = newExt;
    }

    saveExplorer(explorer);
    renderGrid();
}

function handleDelete(
    selectedItemName: string,
    itemType: ExplorerItemType,
) {
    const confirmed = confirm(
        `Are you sure you want to delete the ${itemType} "${selectedItemName}"?`,
    );

    if (!confirmed) return;

    const explorer = loadExplorer();
    const currentFolder = getCurrentFolder(explorer);

    if (!currentFolder) return;

    if (itemType === 'folder') {
        currentFolder.subFolders = currentFolder.subFolders.filter(
            (folder) => folder.name !== selectedItemName,
        );
    } else {
        currentFolder.files = currentFolder.files.filter(
            (file) => file.name !== selectedItemName,
        );
    }

    saveExplorer(explorer);
    renderGrid();
}

function handleRowAction(
    target: HTMLElement,
    row: HTMLTableRowElement,
) {
    const btn = target.closest<HTMLButtonElement>('[data-action]');
    if (!btn) return false;

    const action = btn.dataset.action;
    const selectedItemName = row.dataset.itemName;
    const itemType = row.dataset.itemType as ExplorerItemType;

    if (action === 'update') handleRename(selectedItemName, itemType);
    if (action === 'delete') handleDelete(selectedItemName, itemType);

    return true;
}

function handleFolderNavigation(
    target: HTMLElement,
    row: HTMLTableRowElement,
) {
    if (!target.closest('.explorer-item')) return false;

    const itemName = row.dataset.itemName;
    const itemType = row.dataset.itemType as ExplorerItemType;
    if (itemType !== 'folder') return true;

    const params = new URLSearchParams(window.location.search);
    let currentPath = params.get('folder');

    const newPath = currentPath
        ? `${currentPath}/${itemName}`
        : itemName;

    updateFolderPath(newPath);
    renderGrid();

    return true;
}

function toggleRowSelection(
    row: HTMLTableRowElement,
    tableBody: Element,
) {
    const checkbox = row.querySelector<HTMLInputElement>(
        'input[type="checkbox"]',
    );
    if (!checkbox) return;

    const checked = checkbox.checked;

    tableBody
        ?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
        .forEach((cb) => (cb.checked = false));

    checkbox.checked = !checked;
}

const bindRowService = (tableBody: Element) => {
    tableBody.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const row = target.closest<HTMLTableRowElement>('tr');
        if (!row) return;

        if (handleRowAction(target, row)) return;
        if (handleFolderNavigation(target, row)) return;

        toggleRowSelection(row, tableBody);
    });
};

export default bindRowService;
