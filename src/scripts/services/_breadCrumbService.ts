import renderGrid from '../components/_grid';
import { updateFolderPath } from '../utilities/_helper';

const bindBreadCrumbService = (breadCrumbElement: Element) => {
    breadCrumbElement?.addEventListener('click', (e) => {
        const button = (
            e.target as HTMLElement
        ).closest<HTMLButtonElement>('[data-folder-path]');

        if (!button) return;

        const folderPath = button.dataset.folderPath;
        updateFolderPath(folderPath);
        renderGrid();
    });
};

export default bindBreadCrumbService;
