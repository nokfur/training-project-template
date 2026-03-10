import {
    formatDate,
    getCurrentFolder,
    getFileExtension,
    getUniqueName,
} from '../utilities/_helper';

import {
    FILE_EXTENSIONS,
    FileExtension,
} from '../models/FileExtension';
import IFile from '../models/IFile';
import { loadExplorer, saveExplorer } from '../utilities/_storage';
import IFolder from '../models/IFolder';
import renderGrid from './_grid';
import { ExplorerItemType } from '../models/ExplorerItemType';

function handleFileUpload(file: File) {
    const ext = getFileExtension(file.name);

    if (!FILE_EXTENSIONS.includes(ext)) {
        alert(
            `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
        );
        return;
    }

    const explorer = loadExplorer();
    const folder = getCurrentFolder(explorer);

    if (folder) {
        const fileData: IFile = {
            id: crypto.randomUUID(),
            name: getUniqueName(folder, file.name, 'file'),
            extension: ext,
            modified: formatDate(new Date().toISOString()),
            modifiedBy: 'Administrator MOD',
        };

        folder.files.push(fileData);
        saveExplorer(explorer);

        renderGrid();
    }
}

function handleCreateFolder() {
    const folderName = prompt('Enter folder name:');

    if (!folderName) {
        alert('Folder name cannot be empty.');
        return;
    }

    const explorer = loadExplorer();
    const parentFolder = getCurrentFolder(explorer);

    if (parentFolder) {
        const newFolder: IFolder = {
            id: crypto.randomUUID(),
            name: getUniqueName(parentFolder, folderName, 'folder'),
            modified: formatDate(new Date().toISOString()),
            modifiedBy: 'Administrator MOD',
            files: [],
            subFolders: [],
        };

        parentFolder.subFolders.push(newFolder);
        saveExplorer(explorer);

        renderGrid();
    }
}

function setFolderPath(path?: string) {
    const params = new URLSearchParams(window.location.search);

    if (!path) {
        params.delete('folder');
    } else {
        params.set('folder', path);
    }

    history.pushState({}, '', `?${params.toString()}`);

    renderGrid();
}

function openFolder(folderName: string) {
    const params = new URLSearchParams(window.location.search);
    let currentPath = params.get('folder');

    const newPath = currentPath
        ? `${currentPath}/${folderName}`
        : folderName;

    setFolderPath(newPath);
}

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
        `Are you sure you want to delete "${selectedItemName}"?`,
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

    openFolder(itemName);
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

const initialize = () => {
    const uploadBtn = document.querySelector('#fileUploadBtn');
    const newFolderBtn = document.querySelector('#newFolderBtn');
    const tableBody = document.querySelector('.table-body');
    const breadCrumb = document.querySelector('.breadcrumb');

    uploadBtn?.addEventListener('change', (e) => {
        const input = e.target as HTMLInputElement;
        const files = input.files;

        if (!files || files.length === 0) return;

        for (const file of files) {
            handleFileUpload(file);
        }

        // reset file input to allow uploading same file again if needed
        input.value = '';
    });

    newFolderBtn?.addEventListener('click', () => {
        handleCreateFolder();
    });

    tableBody?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const row = target.closest<HTMLTableRowElement>('tr');
        if (!row) return;

        if (handleRowAction(target, row)) return;
        if (handleFolderNavigation(target, row)) return;

        toggleRowSelection(row, tableBody);
    });

    breadCrumb?.addEventListener('click', (e) => {
        const button = (
            e.target as HTMLElement
        ).closest<HTMLButtonElement>('[data-folder-path]');

        if (!button) return;

        const folderPath = button.dataset.folderPath;
        setFolderPath(folderPath);
    });

    // reload page when user navigates with browser back/forward buttons
    window.addEventListener('popstate', () => {
        renderGrid();
    });
};

export default initialize;
