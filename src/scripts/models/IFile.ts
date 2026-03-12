import { FileExtension } from './FileExtension';

export default interface IFile {
    id: string;
    name: string;
    extension: FileExtension;
    modified: string;
    modifiedBy: string;
    isGlimmer: boolean;
}
