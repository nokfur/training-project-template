import FileExtension from './FileExtension';

export default interface File {
    id: string;
    name: string;
    extension: FileExtension;
    modified: string;
    modifiedBy: string;
}
