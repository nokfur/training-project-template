import { Helper } from '../_helper';
import { StorageService } from './StorageService';
import IFile from '../../models/IFile';
import { FILE_EXTENSIONS } from '../../models/FileExtension';

export class FileService {
    // avoid using static explorer to prevent data is outdated after some other actions
    // always data get from the storage

    static async create(name: string): Promise<IFile> {
        name = name.trim();

        if (!name) throw new Error('File name cannot be empty.');
        if (!Helper.isValidFileExtension(name))
            throw new Error(
                'File name is not valid. *Supported extensions: ' +
                    FILE_EXTENSIONS.join(', '),
            );

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);

        if (!currentFolder)
            throw new Error('Current folder not found.');

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

        return newFile;
    }

    static async upload(files: FileList): Promise<IFile[]> {
        if (!files || files.length === 0)
            throw new Error('No files selected');

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);

        if (!currentFolder)
            throw new Error('Current folder not found');

        const upcomingFiles: IFile[] = [];
        const notSupportedFiles: string[] = [];

        for (const file of files) {
            if (!Helper.isValidFileExtension(file.name)) {
                notSupportedFiles.push(file.name);
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

        // prevent all upload if there is any unsupported file to avoid confusion of partial upload
        if (notSupportedFiles.length > 0) {
            throw new Error(
                `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.\n${notSupportedFiles.join(', ')}.`,
            );
        }

        // prevent redundant save if no valid file to add
        if (upcomingFiles.length > 0) {
            currentFolder.files.push(...upcomingFiles);
            currentFolder.files.sort((a, b) =>
                a.name.localeCompare(b.name),
            );

            StorageService.saveExplorer(explorer);
        }

        return upcomingFiles;
    }

    static async update(id: string, newName: string): Promise<IFile> {
        newName = newName.trim();

        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id) as IFile;

        if (!item) throw new Error('File not found.');
        if (!newName) throw new Error('File name cannot be empty.');
        if (newName === item.name) return item;

        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder)
            throw new Error('Current folder not found.');

        // validate file extension if user input new name with extension
        if (newName.includes('.')) {
            if (!Helper.isValidFileExtension(newName)) {
                throw new Error(
                    `Unsupported file type. Only ${FILE_EXTENSIONS.join(', ')} allowed.`,
                );
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

        return item;
    }

    static async delete(id: string): Promise<void> {
        if (!id) return;

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder)
            throw new Error('Current folder not found.');

        currentFolder.files = currentFolder.files.filter(
            (file) => file.id !== id,
        );
        StorageService.saveExplorer(explorer);
    }

    static async view(id: string): Promise<void> {
        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id);

        if (!item) throw new Error('File not found.');

        item.isGlimmer = false;
        StorageService.saveExplorer(explorer);
    }
}
