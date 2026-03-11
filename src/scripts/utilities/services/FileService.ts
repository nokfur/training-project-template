import { Helper } from '../_helper';
import IFolder from '../../models/IFolder';
import { StorageService } from './StorageService';
import IFile from '../../models/IFile';
import { FILE_EXTENSIONS } from '../../models/FileExtension';

export class FileService {
    private static explorer = StorageService.loadExplorer();

    private static isValidFileName(name: string): boolean {
        const ext = Helper.getFileExtension(name);
        if (!FILE_EXTENSIONS.includes(ext)) return false;
        return true;
    }

    static upload(files: FileList) {
        if (!files || files.length === 0) return;

        const folder = Helper.getCurrentFolder(this.explorer);
        if (!folder) return;

        const upcomingFiles: IFile[] = [];
        for (const file of files) {
            if (!this.isValidFileName(file.name)) {
                alert(
                    `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
                );
                continue;
            }

            const fileData: IFile = {
                id: crypto.randomUUID(),
                name: Helper.getUniqueFileName(folder, file.name),
                extension: Helper.getFileExtension(file.name),
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
            };

            upcomingFiles.push(fileData);
        }

        // prevent redundant save if no valid file to add
        if (upcomingFiles.length === 0) return;

        folder.files.push(...upcomingFiles);
        StorageService.saveExplorer(this.explorer);
    }

    static update(id: string, newName: string) {
        newName = newName.trim();
        const item = Helper.getItemById(this.explorer, id) as IFile;

        if (!item || !newName || newName === item.name) return;

        const currentFolder = Helper.getCurrentFolder(this.explorer);
        if (!currentFolder) return;

        if (newName.includes('.')) {
            if (!this.isValidFileName(newName)) {
                alert(
                    `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
                );
                return;
            }

            item.extension = Helper.getFileExtension(newName);
        } else newName = `${newName}.${item.extension}`;

        item.name = Helper.getUniqueFileName(
            currentFolder,
            newName,
            item.id,
        );
        StorageService.saveExplorer(this.explorer);
    }

    static delete(id: string) {
        if (!id) return;

        const currentFolder = Helper.getCurrentFolder(this.explorer);
        if (!currentFolder) return;

        currentFolder.files = currentFolder.files.filter(
            (file) => file.id !== id,
        );
        StorageService.saveExplorer(this.explorer);
    }
}
