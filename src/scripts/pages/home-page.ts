import ready from '../utilities/_helper';
import renderGrid from '../components/_grid';
import 'bootstrap';
import bindFileService from '../services/_fileService';
import bindFolderService from '../services/_folderService';

ready(() => {
    renderGrid();

    bindFileService();
    bindFolderService();
});
