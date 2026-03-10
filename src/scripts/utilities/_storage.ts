import IFile from '../models/IFile';
import IFolder from '../models/IFolder';

const STORAGE_KEY = 'explorer';

function mockFileData(): IFile[] {
    return [
        {
            id: '1',
            name: 'CoasterAndBargeLoading.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            extension: 'xlsx',
        },
        {
            id: '2',
            name: 'RevenueByServices.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            extension: 'xlsx',
        },
        {
            id: '3',
            name: 'RevenueByServices2016.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            extension: 'xlsx',
        },
        {
            id: '4',
            name: 'RevenueByServices2017.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            extension: 'xlsx',
        },
    ];
}

function mockFolderData(): IFolder[] {
    return [
        {
            id: '1',
            name: 'CAS',
            modified: 'April 30',
            modifiedBy: 'Megan Bowen',
            files: [],
            subFolders: [],
        },
    ];
}

function initExplorer() {
    const root: IFolder = {
        id: 'root',
        name: 'Root',
        modified: new Date().toISOString(),
        modifiedBy: 'System',
        files: mockFileData(),
        subFolders: mockFolderData(),
    };
    saveExplorer(root);
}

export function loadExplorer(): IFolder {
    const data = localStorage.getItem(STORAGE_KEY);

    if (data) return JSON.parse(data);

    initExplorer();
    return loadExplorer();
}

export function saveExplorer(data: IFolder) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
