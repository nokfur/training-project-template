import renderGrid from '../components/_grid';
import bindFileService from './_fileService';
import bindFolderService from './_folderService';
import bindBreadCrumbService from './_breadCrumbService';
import bindRowService from './_rowService';

const bindItemServices = () => {
    bindBreadCrumbService();
    bindRowService();

    // reload page when user navigates with browser back/forward buttons
    window.addEventListener('popstate', () => {
        renderGrid();
    });
};

export default bindItemServices;
