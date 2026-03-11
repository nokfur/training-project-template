import renderGrid from '../components/_grid';
import { FileService } from '../utilities/services/FileService';

function handleUpload(e: Event) {
    const input = e.target as HTMLInputElement;

    FileService.upload(input.files);

    // reset file input to allow uploading same file again if needed
    input.value = '';
    renderGrid();
}

const bindFileService = () => {
    const uploadBtn = document.querySelector('#fileUploadBtn');

    uploadBtn?.addEventListener('change', handleUpload);
};

export default bindFileService;
