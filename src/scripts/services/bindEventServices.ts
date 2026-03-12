import renderGrid from '../components/_grid';
import bindBreadCrumbService from './_breadCrumbService';
import bindFileService from './_fileService';
import bindFolderService from './_folderService';
import bindRowService from './_rowService';

const bindEventServices = () => {
    bindFileService();
    bindFolderService();
    bindBreadCrumbService();
    bindRowService();
};

export default bindEventServices;
