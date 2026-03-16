import { FILE_EXTENSIONS } from '../models/FileExtension';
import IFile from '../models/IFile';
import IFolder from '../models/IFolder';

const ready = (fn: () => void) => {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

export default ready;

export class Helper {
    static getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() ?? '';
    }

    static getItemById(
        root: IFolder,
        id: string,
    ): IFile | IFolder | null {
        for (const file of root.files) {
            if (file.id === id) return file;
        }

        for (const subFolder of root.subFolders) {
            if (subFolder.id === id) return subFolder;
            const foundInSub = this.getItemById(subFolder, id);
            if (foundInSub) return foundInSub;
        }
        return null;
    }

    private static deepDecode(value: string): string {
        let decoded = value;
        let prev;

        do {
            prev = decoded;
            decoded = decodeURIComponent(decoded);
        } while (decoded !== prev);

        return decoded;
    }

    static getFolderPath(): string[] {
        const params = new URLSearchParams(window.location.search);
        const folderPath = params.get('folder');

        if (!folderPath) return [];

        // deep decode to handle multiple levels of encoding (e.g. when folder name contains special characters and spaces)
        return this.deepDecode(folderPath).split('/');
    }

    // use root as param to have target folder have reference to the root
    static getCurrentFolder(root: IFolder): IFolder | null {
        const folderPath = this.getFolderPath();

        if (folderPath.length === 0) return root;

        let currentFolder = root;
        for (const folderName of folderPath) {
            let found = false;
            for (const subFolder of currentFolder.subFolders) {
                if (subFolder.name === folderName) {
                    currentFolder = subFolder;
                    found = true;
                    break;
                }
            }

            // no matching folder found, return null to indicate invalid path
            if (!found) return null;
        }
        return currentFolder;
    }

    static updateFolderPath(folderName: string) {
        const params = new URLSearchParams(window.location.search);
        let currentPath = params.get('folder');

        const newPath = currentPath
            ? `${currentPath}/${folderName}`
            : folderName;

        return newPath;
    }

    static updateFolderUrlPath(path?: string) {
        const params = new URLSearchParams(window.location.search);

        if (!path) {
            params.delete('folder');
        } else {
            // encode path to handle special characters, spaces and unicode
            params.set('folder', encodeURIComponent(path));
        }

        history.pushState({}, '', `?${params.toString()}`);
    }

    static isValidFileExtension(name: string): boolean {
        if (!name || !name.includes('.')) return false;

        const ext = Helper.getFileExtension(name);
        if (!FILE_EXTENSIONS.includes(ext)) return false;

        return true;
    }

    private static getUniqueName(
        existingNames: Set<string>,
        name: string,
    ) {
        let uniqueName = name;
        let counter = 1;

        while (existingNames.has(uniqueName)) {
            uniqueName = `${name} (${counter})`;
            counter++;
        }

        return uniqueName;
    }

    static getUniqueFileName(
        parentFolder: IFolder,
        name: string,
        id?: string,
    ) {
        const existingNames = new Set(
            parentFolder.files
                .filter((file) => file.id !== id)
                .map((file) => file.name),
        );

        return this.getUniqueName(existingNames, name);
    }

    static getUniqueFolderName(
        parentFolder: IFolder,
        name: string,
        id?: string,
    ) {
        const existingNames = new Set(
            parentFolder.subFolders
                .filter((subFolder) => subFolder.id !== id)
                .map((subFolder) => subFolder.name),
        );

        return this.getUniqueName(existingNames, name);
    }

    static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    static formatDate(value: string): string {
        const timestamp = Date.parse(value);

        // if value is not a valid date, return it as is (e.g. "a few seconds ago")
        if (Number.isNaN(timestamp)) {
            return value;
        }

        const date = new Date(timestamp);

        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();

        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');

        return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
    }
}
