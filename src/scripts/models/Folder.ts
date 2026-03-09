import File from './File';

export default interface Folder {
    id: string;
    name: string;
    files: File[];
    subFolders: Folder[];
    modified: string;
    modifiedBy: string;
}
