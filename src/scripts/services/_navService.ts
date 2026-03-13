import renderGrid from '../components/_grid';
import { InputModal } from '../components/modals/InputModal';
import { FileService } from '../utilities/services/FileService';
import { FolderService } from '../utilities/services/FolderService';

function handleCreateFolder() {
    const inputModal = new InputModal();
    inputModal.prompt('Enter folder name', async (name) => {
        await FolderService.create(name);
        renderGrid();
    });
}

function handleCreateFile() {
    const inputModal = new InputModal();
    inputModal.prompt('Enter file name', async (name) => {
        await FileService.create(name);
        renderGrid();
    });
}

function handleUpload(e: Event) {
    const input = e.target as HTMLInputElement;

    FileService.upload(input.files as FileList)
        .then(() => {
            renderGrid();
        })
        .catch((error) => {
            alert(error.message);
        })
        .finally(() => {
            // reset file input to allow uploading same file again if needed
            input.value = '';
        });
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
