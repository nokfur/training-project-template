import renderGrid from '../components/_grid';
import { InputModal } from '../models/InputModal';
import { FileService } from '../utilities/services/FileService';
import { FolderService } from '../utilities/services/FolderService';

function handleCreateFolder() {
    const inputModal = new InputModal();
    inputModal.prompt('Enter item name', (name) => {
        FolderService.create(name);

        renderGrid();
    });
}

function handleCreateFile() {
    const inputModal = new InputModal();
    inputModal.prompt('Enter item name', (name) => {
        FileService.create(name);

        renderGrid();
    });
}

function handleUpload(e: Event) {
    const input = e.target as HTMLInputElement;

    FileService.upload(input.files);

    // reset file input to allow uploading same file again if needed
    input.value = '';
    renderGrid();
}

const bindNavService = () => {
    const uploadBtn = document.querySelector('#itemUploadBtn');
    const createFolderBtn = document.querySelector('#newFolderBtn');
    const createFileBtn = document.querySelector('#newFileBtn');

    uploadBtn?.removeEventListener('change', handleUpload);
    uploadBtn?.addEventListener('change', handleUpload);

    createFolderBtn?.removeEventListener('click', handleCreateFolder);
    createFolderBtn?.addEventListener('click', handleCreateFolder);

    createFileBtn?.removeEventListener('click', handleCreateFile);
    createFileBtn?.addEventListener('click', handleCreateFile);
};

export default bindNavService;
