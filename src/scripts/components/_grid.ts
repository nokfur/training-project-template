const renderGrid = () => {
    // TODO: implement code to Render grid
    type FileData = {
        name: string;
        modified: string;
        modifiedBy: string;
        fileType: 'folder' | 'excel';
    };

    const fileData: FileData[] = [
        {
            name: 'CAS',
            modified: 'April 30',
            modifiedBy: 'Megan Bowen',
            fileType: 'folder',
        },
        {
            name: 'CoasterAndBargeLoading.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
        },
        {
            name: 'RevenueByServices.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
        },
        {
            name: 'RevenueByServices2016.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
        },
        {
            name: 'RevenueByServices2017.xlsx',
            modified: 'A few seconds ago',
            modifiedBy: 'Administrator MOD',
            fileType: 'excel',
        },
    ];

    const tableBody: HTMLElement | null = document.querySelector(
        '.table-body',
    );

    const html = fileData
        .map(data => {
            if (data.fileType === 'folder') {
                return `<tr class="border-bottom">
                            <td
                                class="text-right"
                                data-label="File Type"
                            >
                                <iconify-icon
                                    icon="glyphs:folder-duo"
                                    class="icon-lg"
                                ></iconify-icon>
                            </td>
                            <td data-label="Name">${data.name}</td>
                            <td data-label="Modified">
                                ${data.modified}
                            </td>
                            <td data-label="Modified By">
                                ${data.modifiedBy}
                            </td>
                            <td></td>
                        </tr>`;
            }
            return `<tr class="border-bottom">
                            <td
                                class="text-right"
                                data-label="File Type"
                            >
                                <iconify-icon
                                    icon="vscode-icons:file-type-excel"
                                    class="icon-lg"
                                ></iconify-icon>
                            </td>
                            <td data-label="Name">
                                <div class="position-relative">
                                    <span class="glimmer">
                                        <iconify-icon
                                            icon="tabler:loader-quarter"
                                            class="icon-lg text-pink"
                                        ></iconify-icon>
                                    </span>

                                    ${data.name}
                                </div>
                            </td>
                            <td data-label="Modified">
                                ${data.modified}
                            </td>
                            <td data-label="Modified By">
                                ${data.modifiedBy}
                            </td>
                            <td></td>
                        </tr>`;
        })
        .join('');

    if (tableBody) tableBody.innerHTML = html;
};

export default renderGrid;
