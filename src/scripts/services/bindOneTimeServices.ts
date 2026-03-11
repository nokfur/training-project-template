import renderGrid from '../components/_grid';
import bindFileService from './_fileService';
import bindFolderService from './_folderService';

const bindOneTimeServices = () => {
    bindFileService();
    bindFolderService();

    // reload page when user navigates with browser back/forward buttons
    window.addEventListener('popstate', () => {
        renderGrid();
    });
};

export default bindOneTimeServices;
