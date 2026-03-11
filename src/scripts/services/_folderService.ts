import IFolder from '../models/IFolder';
import {
    formatDate,
    getCurrentFolder,
    getUniqueName,
} from '../utilities/_helper';
import { loadExplorer, saveExplorer } from '../utilities/_storage';
import renderGrid from '../components/_grid';

function handleCreateFolder() {
    const folderName = prompt('Enter folder name:').trim();

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

const bindFolderService = () => {
    const createFolderBtn = document.querySelector('#newFolderBtn');

    createFolderBtn?.addEventListener('click', () => {
        handleCreateFolder();
    });
};

export default bindFolderService;
