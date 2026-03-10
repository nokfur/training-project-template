import IFile from './IFile';

export default interface IFolder {
    id: string;
    name: string;
    files: IFile[];
    subFolders: IFolder[];
    modified: string;
    modifiedBy: string;
}
