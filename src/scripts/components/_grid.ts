import ExplorerItem from '../models/ExplorerItem';
import File from '../models/File';
import FileExtension from '../models/FileExtension';
import Folder from '../models/Folder';

function getData(): ExplorerItem[] {
    const folderData: Folder[] = [
        {
            id: '1',
            name: 'CAS',
            modified: 'April 30',
            modifiedBy: 'Megan Bowen',
            files: [],
            subFolders: [],
        },
    ];

    const fileData: File[] = [
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

    return [
        ...folderData.map(folder => ({
            ...folder,
            type: 'folder' as const,
        })),
        ...fileData.map(file => ({
            ...file,
            type: 'file' as const,
        })),
    ];
}

function getItemIcon(item: ExplorerItem): string {
    const itemIconMap: Record<'folder' | FileExtension, string> = {
        folder: 'glyphs:folder-duo',
        xlsx: 'vscode-icons:file-type-excel',
        docs: 'vscode-icons:file-type-doc',
        pptx: 'vscode-icons:file-type-ppt',
    };

    if (item.type === 'folder') {
        return 'glyphs:folder-duo';
    }

    return itemIconMap[item.extension];
}

const renderGrid = () => {
    // TODO: implement code to Render grid
    const data = getData();

    const tableBody: HTMLElement | null = document.querySelector(
        '.table-body',
    );

    const html = data
        .map(
            data => `<tr>
                        <td data-label="File Type">
                            <div class="d-flex align-items-center justify-content-end h-100">
                                <iconify-icon icon="${getItemIcon(data)}" class="fs-4"></iconify-icon>
                            </div>
                        </td>
                        <td class="align-items-center" data-label="Name">
                            ${
                                // show glimmer if the item is a file
                                data.type === 'file'
                                    ? `<div class="position-relative">
                                        <iconify-icon icon="tabler:loader-quarter" class="fs-5 text-pink position-absolute -top-1 -left-2">
                                        </iconify-icon>

                                        ${data.name}
                                    </div>`
                                    : data.name
                            }
                        </td>
                        <td data-label="Modified" class="text-secondary">
                            ${data.modified}
                        </td>
                        <td data-label="Modified By" class="text-secondary">
                            ${data.modifiedBy}
                        </td>
                        <td></td>
                    </tr>`,
        )
        .join('');

    if (tableBody) tableBody.innerHTML = html;
};

export default renderGrid;
