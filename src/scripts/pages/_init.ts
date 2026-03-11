import renderGrid from '../components/_grid';
import bindFileService from '../services/_fileService';
import bindFolderService from '../services/_folderService';
import bindBreadCrumbService from '../services/_breadCrumbService';
import bindRowService from '../services/_rowService';

const initialize = () => {
    const uploadBtn = document.querySelector('#fileUploadBtn');
    const newFolderBtn = document.querySelector('#newFolderBtn');
    const tableBody = document.querySelector('.table-body');
    const breadCrumb = document.querySelector('.breadcrumb');

    bindFileService(uploadBtn as HTMLInputElement);
    bindFolderService(newFolderBtn);
    bindBreadCrumbService(breadCrumb);
    bindRowService(tableBody);

    // reload page when user navigates with browser back/forward buttons
    window.addEventListener('popstate', () => {
        renderGrid();
    });
};

export default initialize;
