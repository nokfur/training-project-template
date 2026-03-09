import File from './File';
import Folder from './Folder';

interface FileItem extends File {
    type: 'file';
}

interface FolderItem extends Folder {
    type: 'folder';
}

type ExplorerItem = FileItem | FolderItem;
export default ExplorerItem;
