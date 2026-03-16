import { FileExtension } from './FileExtension';

export default interface IFile {
    id: string;
    name: string;
    extension: FileExtension;
    createdAt: string;
    modifiedAt: string;
    modifiedBy: string;
    isGlimmer: boolean;
}
