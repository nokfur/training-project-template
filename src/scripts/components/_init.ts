import {
    formatDate,
    getCurrentFolder,
    getFileExtension,
    getUniqueName,
} from '../utilities/_helper';

import { FILE_EXTENSIONS } from '../models/FileExtension';
import IFile from '../models/IFile';
import { loadExplorer, saveExplorer } from '../utilities/_storage';
import IFolder from '../models/IFolder';
import renderGrid from './_grid';

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

const initialize = () => {
    const uploadBtn = document.querySelector('#fileUpload');
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
        const row = (
            e.target as HTMLElement
        ).closest<HTMLTableRowElement>('[data-folder-name]');

        if (!row) return;

        const folderName = row.dataset.folderName;

        if (!folderName) return;

        openFolder(folderName);
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
