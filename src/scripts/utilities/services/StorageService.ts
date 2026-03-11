import IFile from '../../models/IFile';
import IFolder from '../../models/IFolder';

export class StorageService {
    private static STORAGE_KEY = 'explorer';
    private static explorer: IFolder;

    private static mockFileData(): IFile[] {
        return [
            {
                id: '1',
                name: 'CoasterAndBargeLoading.xlsx',
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
            },
            {
                id: '2',
                name: 'RevenueByServices.xlsx',
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
            },
            {
                id: '3',
                name: 'RevenueByServices2016.xlsx',
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
            },
            {
                id: '4',
                name: 'RevenueByServices2017.xlsx',
                modified: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
            },
        ];
    }

    private static mockFolderData(): IFolder[] {
        return [
            {
                id: '1',
                name: 'CAS',
                modified: new Date().toISOString(),
                modifiedBy: 'Megan Bowen',
                files: [],
                subFolders: [],
            },
        ];
    }

    private static initExplorer() {
        const root: IFolder = {
            id: 'root',
            name: 'Root',
            modified: new Date().toISOString(),
            modifiedBy: 'System',
            files: this.mockFileData(),
            subFolders: this.mockFolderData(),
        };
        this.saveExplorer(root);
    }

    static loadExplorer(): IFolder {
        // return cached data if exist to avoid unnecessary localStorage access and parsing
        if (this.explorer) return this.explorer;

        const data = localStorage.getItem(this.STORAGE_KEY);

        if (data) return JSON.parse(data);

        // if no data in localStorage, initialize it with mock data and return
        this.initExplorer();
        return this.loadExplorer();
    }

    static saveExplorer(data: IFolder) {
        this.explorer = data;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
}
