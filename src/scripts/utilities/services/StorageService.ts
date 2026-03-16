import IFile from '../../models/IFile';
import IFolder from '../../models/IFolder';

export class StorageService {
    private static STORAGE_KEY = 'explorer';
    private static explorer: IFolder;

    private static mockFileData(): IFile[] {
        return [
            {
                id: crypto.randomUUID(),
                name: 'CoasterAndBargeLoading.xlsx',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
                isGlimmer: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'RevenueByServices.xlsx',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
                isGlimmer: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'RevenueByServices2016.xlsx',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
                isGlimmer: true,
            },
            {
                id: crypto.randomUUID(),
                name: 'RevenueByServices2017.xlsx',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'Administrator MOD',
                extension: 'xlsx',
                isGlimmer: true,
            },
        ];
    }

    private static mockFolderData(): IFolder[] {
        return [
            {
                id: crypto.randomUUID(),
                name: 'CAS',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                modifiedBy: 'Megan Bowen',
                files: [],
                subFolders: [],
                isGlimmer: true,
            },
        ];
    }

    private static initExplorer() {
        const root: IFolder = {
            id: crypto.randomUUID(),
            name: 'Root',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            modifiedBy: 'System',
            files: this.mockFileData(),
            subFolders: this.mockFolderData(),
            isGlimmer: true,
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
