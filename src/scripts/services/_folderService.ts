import IFolder from '../models/IFolder';
import renderGrid from '../components/_grid';
import { Helper } from '../utilities/_helper';
import { FolderService } from '../utilities/services/FolderService';

function handleCreateFolder() {
    const folderName = prompt('Enter folder name:');

    FolderService.create(folderName);

    renderGrid();
}

const bindFolderService = () => {
    const createFolderBtn = document.querySelector('#newFolderBtn');

    createFolderBtn?.addEventListener('click', () => {
        handleCreateFolder();
    });
};

export default bindFolderService;
