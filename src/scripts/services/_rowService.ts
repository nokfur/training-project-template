import renderGrid from '../components/_grid';
import { ExplorerItemType } from '../models/ExplorerItemType';
import { Helper } from '../utilities/_helper';
import { FileService } from '../utilities/services/FileService';
import { FolderService } from '../utilities/services/FolderService';
import { StorageService } from '../utilities/services/StorageService';

function handleRename(
    selectedItemId: string,
    itemType: ExplorerItemType,
) {
    const item = Helper.getItemById(
        StorageService.loadExplorer(),
        selectedItemId,
    );

    const newName = prompt(`Enter new ${itemType} name:`, item.name);

    if (itemType === 'folder')
        FolderService.update(selectedItemId, newName);
    else if (itemType === 'file')
        FileService.update(selectedItemId, newName);

    renderGrid();
}

function handleDelete(
    selectedItemId: string,
    itemType: ExplorerItemType,
) {
    const item = Helper.getItemById(
        StorageService.loadExplorer(),
        selectedItemId,
    );
    const confirmed = confirm(
        `Are you sure you want to delete the ${itemType} "${item.name}"?`,
    );

    if (!confirmed) return;

    if (itemType === 'folder') FolderService.delete(selectedItemId);
    else if (itemType === 'file') FileService.delete(selectedItemId);

    renderGrid();
}

function toggleRowSelection(row: Element) {
    const checkbox = row.querySelector<HTMLInputElement>(
        'input[type="checkbox"]',
    );
    const checkboxes = row
        .closest('.table-body')
        ?.querySelectorAll<HTMLInputElement>(
            'input[type="checkbox"]',
        );
    if (checkboxes.length === 0) return;

    const checked = checkbox.checked;

    checkboxes.forEach((cb) => (cb.checked = false));

    checkbox.checked = !checked;
}

const bindRowService = () => {
    const tableRows = document.querySelectorAll('.table-row');
    const explorerItems = document.querySelectorAll('.explorer-item');
    const updateButtons = document.querySelectorAll(
        '.btn-item-update',
    );
    const deleteButtons = document.querySelectorAll(
        '.btn-item-delete',
    );

    tableRows.forEach((row) => {
        row.addEventListener('click', (e) => {
            toggleRowSelection(row);
        });
    });

    explorerItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            const folderName = item.getAttribute('data-folder-name');
            FolderService.navigateTo(folderName);

            renderGrid();
        });
    });

    updateButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const itemId = btn.getAttribute('data-item-id');
            const itemType = btn.getAttribute(
                'data-item-type',
            ) as ExplorerItemType;

            handleRename(itemId, itemType);
        });
    });

    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const itemId = btn.getAttribute('data-item-id');
            const itemType = btn.getAttribute(
                'data-item-type',
            ) as ExplorerItemType;

            handleDelete(itemId, itemType);
        });
    });
};

export default bindRowService;
