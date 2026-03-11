import IFolder from '../../models/IFolder';
import { Helper } from '../_helper';
import { StorageService } from './StorageService';

export class FolderService {
    private static explorer = StorageService.loadExplorer();

    static create(name: string): boolean {
        if (!name) {
            alert('Folder name cannot be empty.');
            return false;
        }

        const currentFolder = Helper.getCurrentFolder(this.explorer);
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
        StorageService.saveExplorer(this.explorer);
    }

    static update(id: string, newName: string) {
        newName = newName.trim();
        const item = Helper.getItemById(this.explorer, id);

        if (!item || !newName || newName === item.name) return;

        const currentFolder = Helper.getCurrentFolder(this.explorer);
        if (!currentFolder) return;

        item.name = Helper.getUniqueFolderName(
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

        currentFolder.subFolders = currentFolder.subFolders.filter(
            (folder) => folder.id !== id,
        );
        StorageService.saveExplorer(this.explorer);
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
