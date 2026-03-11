import renderGrid from '../components/_grid';
import { Helper } from '../utilities/_helper';

const bindBreadCrumbService = () => {
    const breadCrumb = document.querySelector('.breadcrumb');

    breadCrumb?.addEventListener('click', (e) => {
        const button = (
            e.target as HTMLElement
        ).closest<HTMLButtonElement>('[data-folder-path]');

        if (!button) return;

        const folderPath = button.dataset.folderPath;
        Helper.updateFolderPath(folderPath);
        renderGrid();
    });
};

export default bindBreadCrumbService;
