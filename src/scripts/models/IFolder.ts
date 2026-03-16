import IFile from './IFile';

export default interface IFolder {
    id: string;
    name: string;
    files: IFile[];
    subFolders: IFolder[];
    createdAt: string;
    modifiedAt: string;
    modifiedBy: string;
    isGlimmer: boolean;
}
