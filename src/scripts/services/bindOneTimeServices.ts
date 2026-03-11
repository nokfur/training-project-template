import bindFileService from './_fileService';
import bindFolderService from './_folderService';

const bindOneTimeServices = () => {
    bindFileService();
    bindFolderService();
};

export default bindOneTimeServices;
