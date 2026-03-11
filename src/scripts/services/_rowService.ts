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

function handleFolderNavigation(folderName: string) {
    if (!folderName) return;

    const params = new URLSearchParams(window.location.search);
    let currentPath = params.get('folder');

    const newPath = currentPath
        ? `${currentPath}/${folderName}`
        : folderName;

    updateFolderPath(newPath);
    renderGrid();
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

function handleTableClick(e: Event) {
    const target = e.target as HTMLElement;

    const row = target.closest<HTMLTableRowElement>('tr');
    if (!row) return;

    const tableBody = row.closest('.table-body');
    if (!tableBody) return;

    toggleRowSelection(row, tableBody);
}

const bindRowService = () => {
    const tableBody = document.querySelector('.table-body');
    const explorerItems = document.querySelectorAll('.explorer-item');
    const updateButtons = document.querySelectorAll(
        '.btn-item-update',
    );
    const deleteButtons = document.querySelectorAll(
        '.btn-item-delete',
    );

    // renderGrid called many times will cause multiple event listeners binding,
    // so we need to remove old event listener before adding new one
    tableBody.removeEventListener('click', handleTableClick);
    tableBody.addEventListener('click', handleTableClick);

    explorerItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            const folderName = item.getAttribute('data-folder-name');
            handleFolderNavigation(folderName);
        });
    });

    updateButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const itemName = btn.getAttribute('data-item-name');
            const itemType = btn.getAttribute(
                'data-item-type',
            ) as ExplorerItemType;
            handleRename(itemName, itemType);
        });
    });

    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const itemName = btn.getAttribute('data-item-name');
            const itemType = btn.getAttribute(
                'data-item-type',
            ) as ExplorerItemType;
            handleDelete(itemName, itemType);
        });
    });
};

export default bindRowService;
