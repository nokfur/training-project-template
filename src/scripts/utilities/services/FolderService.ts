import IFolder from '../../models/IFolder';
import { Helper } from '../_helper';
import { StorageService } from './StorageService';

export class FolderService {
    // avoid using static explorer to prevent data is outdated after some other actions
    // always data get from the storage

    static create(name: string): boolean {
        if (!name) {
            alert('Folder name cannot be empty.');
            return false;
        }

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

        const newFolder: IFolder = {
            id: crypto.randomUUID(),
            name: Helper.getUniqueFolderName(currentFolder, name),
            modified: new Date().toISOString(),
            modifiedBy: 'Administrator MOD',
            files: [],
            subFolders: [],
        };

        currentFolder.subFolders.push(newFolder);
        StorageService.saveExplorer(explorer);
    }

    static update(id: string, newName: string) {
        newName = newName.trim();

        const explorer = StorageService.loadExplorer();
        const item = Helper.getItemById(explorer, id);

        if (!item || !newName || newName === item.name) return;

        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

        item.name = Helper.getUniqueFolderName(
            currentFolder,
            newName,
            item.id,
        );

        StorageService.saveExplorer(explorer);
    }

    static delete(id: string) {
        if (!id) return;

        const explorer = StorageService.loadExplorer();
        const currentFolder = Helper.getCurrentFolder(explorer);
        if (!currentFolder) return;

        currentFolder.subFolders = currentFolder.subFolders.filter(
            (folder) => folder.id !== id,
        );
        StorageService.saveExplorer(explorer);
    }

    static navigateTo(folderName: string) {
        if (!folderName) return;

        const params = new URLSearchParams(window.location.search);
        let currentPath = params.get('folder');

        const newPath = currentPath
            ? `${currentPath}/${folderName}`
            : folderName;

        Helper.updateFolderPath(newPath);
    }
}
