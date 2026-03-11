import { FILE_EXTENSIONS } from '../models/FileExtension';
import IFile from '../models/IFile';
import {
    formatDate,
    getCurrentFolder,
    getFileExtension,
    getUniqueName,
} from '../utilities/_helper';
import { loadExplorer, saveExplorer } from '../utilities/_storage';
import renderGrid from '../components/_grid';

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

function handleUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    for (const file of files) {
        handleFileUpload(file);
    }

    // reset file input to allow uploading same file again if needed
    input.value = '';
}

const bindFileService = () => {
    const uploadBtn = document.querySelector('#fileUploadBtn');

    uploadBtn?.addEventListener('change', handleUpload);
};

export default bindFileService;
