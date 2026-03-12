import { Helper } from '../_helper';
import IFolder from '../../models/IFolder';
import { StorageService } from './StorageService';
import IFile from '../../models/IFile';
import { FILE_EXTENSIONS } from '../../models/FileExtension';

export class FileService {
    // avoid using static explorer to prevent data is outdated after some other actions
    // always data get from the storage

    private static isValidFileName(name: string): boolean {
        const ext = Helper.getFileExtension(name);
        if (!FILE_EXTENSIONS.includes(ext)) return false;
        return true;
    }

    static create(name: string) {
        name = name.trim();

        if (!name) return;
        if (!this.isValidFileName(name)) {
            alert(
                `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
            );
            return;
        }

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);

        if (!currentFolder) return;

        const newFile: IFile = {
            id: crypto.randomUUID(),
            name: Helper.getUniqueFileName(currentFolder, name),
            extension: Helper.getFileExtension(name),
            modified: new Date().toISOString(),
            modifiedBy: 'Administrator MOD',
            isGlimmer: true,
        };

        currentFolder.files.push(newFile);
        currentFolder.files.sort((a, b) =>
            a.name.localeCompare(b.name),
        );

        StorageService.saveExplorer(explorer);
    }

    static upload(files: FileList) {
        if (!files || files.length === 0) return;

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

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
                name: Helper.getUniqueFileName(
                    currentFolder,
                    file.name,
                ),
                extension: Helper.getFileExtension(file.name),
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                isGlimmer: true,
            };

            upcomingFiles.push(fileData);
        }

        // prevent redundant save if no valid file to add
        if (upcomingFiles.length === 0) return;

        currentFolder.files.push(...upcomingFiles);
        currentFolder.files.sort((a, b) =>
            a.name.localeCompare(b.name),
        );

        StorageService.saveExplorer(explorer);
    }

    static update(id: string, newName: string) {
        newName = newName.trim();

        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id) as IFile;

        if (!item || !newName || newName === item.name) return;

        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

        if (newName.includes('.')) {
            if (!this.isValidFileName(newName)) {
                alert(
                    `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
                );
                return;
            }

            item.extension = Helper.getFileExtension(newName);
        } else {
            // default to .txt if no extension provided
            newName = `${newName}.txt`;
            item.extension = 'txt';
        }

        item.name = Helper.getUniqueFileName(
            currentFolder,
            newName,
            item.id,
        );

        currentFolder.files.sort((a, b) =>
            a.name.localeCompare(b.name),
        );
        StorageService.saveExplorer(explorer);
    }

    static delete(id: string) {
        if (!id) return;

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

        currentFolder.files = currentFolder.files.filter(
            (file) => file.id !== id,
        );
        StorageService.saveExplorer(explorer);
    }

    static view(id: string) {
        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id);

        if (!item) return;

        item.isGlimmer = false;
        StorageService.saveExplorer(explorer);
    }
}
