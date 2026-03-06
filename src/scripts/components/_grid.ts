const renderGrid = () => {
    // TODO: implement code to Render grid
    type FileType = 'folder' | 'excel';

    type FileData = {
        name: string;
        modified: string;
        modifiedBy: string;
        fileType: FileType;
        isGlimmer: boolean;
    };

    const fileData: FileData[] = [
        {
            name: 'CAS',
            modified: 'April 30',
            modifiedBy: 'Megan Bowen',
            fileType: 'folder',
            isGlimmer: false,
        },
        {
            name: 'CoasterAndBargeLoading.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
            isGlimmer: true,
        },
        {
            name: 'RevenueByServices.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
            isGlimmer: true,
        },
        {
            name: 'RevenueByServices2016.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
            isGlimmer: true,
        },
        {
            name: 'RevenueByServices2017.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
            isGlimmer: true,
        },
    ];

    const fileTypeIconMap: Record<FileType, string> = {
        folder: 'glyphs:folder-duo',
        excel: 'vscode-icons:file-type-excel',
    };

    const tableBody: HTMLElement | null = document.querySelector(
        '.table-body',
    );

    const html = fileData
        .map(
            data => `<tr class="border-bottom">
                            <td
                                class="text-right"
                                data-label="File Type"
                            >
                                <iconify-icon
                                    icon=${
                                        fileTypeIconMap[data.fileType]
                                    }
                                    class="icon-lg text-right align-self-end"
                                ></iconify-icon>
                            </td>
                            <td data-label="Name">
                                ${
                                    data.isGlimmer
                                        ? `<div class="position-relative">
                                    <span class="glimmer">
                                        <iconify-icon
                                            icon="tabler:loader-quarter"
                                            class="icon-lg text-pink"
                                        ></iconify-icon>
                                    </span>

                                    ${data.name}
                                </div>`
                                        : data.name
                                }

                            </td>
                            <td data-label="Modified">
                                ${data.modified}
                            </td>
                            <td data-label="Modified By">
                                ${data.modifiedBy}
                            </td>
                            <td></td>
                        </tr>`,
        )
        .join('');

    if (tableBody) tableBody.innerHTML = html;
};

export default renderGrid;
