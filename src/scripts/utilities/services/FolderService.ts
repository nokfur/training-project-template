import IFolder from '../../models/IFolder';
import { Helper } from '../_helper';
import { StorageService } from './StorageService';

export class FolderService {
    // avoid using static explorer to prevent data is outdated after some other actions
    // always data get from the storage

    static async create(name: string): Promise<IFolder> {
        name = name.trim();

        if (!name) throw new Error('Folder name cannot be empty.');

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);

        if (!currentFolder)
            throw new Error('Current folder not found.');

        const newFolder: IFolder = {
            id: crypto.randomUUID(),
            name: Helper.getUniqueFolderName(currentFolder, name),
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            modifiedBy: 'Administrator MOD',
            files: [],
            subFolders: [],
            isGlimmer: true,
        };

        currentFolder.subFolders.push(newFolder);
        currentFolder.subFolders.sort((a, b) =>
            a.name.localeCompare(b.name),
        );

        StorageService.saveExplorer(explorer);

        return newFolder;
    }

    static async update(
        id: string,
        newName: string,
    ): Promise<IFolder> {
        newName = newName.trim();

        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id) as IFolder;

        if (!item) throw new Error('Folder not found.');
        if (!newName) throw new Error('Folder name cannot be empty.');
        if (item.name === newName) return item; // no change

        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder)
            throw new Error('Current folder not found.');

        item.modifiedAt = new Date().toISOString();

        item.name = Helper.getUniqueFolderName(
            currentFolder,
            newName,
            item.id,
        );

        currentFolder.subFolders.sort((a, b) =>
            a.name.localeCompare(b.name),
        );
        StorageService.saveExplorer(explorer);

        return item;
    }

    static async delete(id: string): Promise<void> {
        if (!id) throw new Error('Invalid folder ID.');

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder)
            throw new Error('Current folder not found.');

        currentFolder.subFolders = currentFolder.subFolders.filter(
            (folder) => folder.id !== id,
        );
        StorageService.saveExplorer(explorer);
    }

    static async navigateTo(folderName: string): Promise<void> {
        if (!folderName) throw new Error('Folder not found.');

        const newPath = Helper.updateFolderPath(folderName);
        Helper.updateFolderUrlPath(newPath);
    }

    static async view(id: string): Promise<void> {
        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id);

        if (!item) throw new Error('Folder not found.');

        item.isGlimmer = false;
        StorageService.saveExplorer(explorer);
    }
}
