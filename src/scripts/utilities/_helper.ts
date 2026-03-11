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

export function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() ?? '';
}

export function getFolderPath(): string[] {
    const params = new URLSearchParams(window.location.search);
    const folderPath = params.get('folder');

    if (!folderPath) return [];
    return folderPath.split('/');
}

export function getCurrentFolder(root: IFolder): IFolder | null {
    const folderPath = getFolderPath();

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

function isNameDuplicate(
    folder: IFolder,
    name: string,
    type: 'file' | 'folder',
): boolean {
    if (type === 'folder') {
        return folder.subFolders.some((f) => f.name === name);
    }

    return folder.files.some((f) => f.name === name);
}

export function getUniqueName(
    folder: IFolder,
    baseName: string,
    type: 'file' | 'folder',
): string {
    let name = baseName;
    let counter = 1;

    while (isNameDuplicate(folder, name, type)) {
        name = `${baseName} (${counter})`;
        counter++;
    }

    return name;
}

export function updateFolderPath(path?: string) {
    const params = new URLSearchParams(window.location.search);

    if (!path) {
        params.delete('folder');
    } else {
        params.set('folder', path);
    }

    history.pushState({}, '', `?${params.toString()}`);
}

export function formatDate(value: string): string {
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
