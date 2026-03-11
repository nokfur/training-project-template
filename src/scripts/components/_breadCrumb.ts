import { Helper } from '../utilities/_helper';

const renderBreadcrumb = () => {
    const container = document.querySelector('.breadcrumb');

    if (!container) return;

    const folderPath = Helper.getFolderPath();

    let accumulatedPath = '';

    let html = `<li class="breadcrumb-item fs-3">
                    <button class="btn fs-3 border-0" data-folder-path="">Documents</button>
                </li>`;
    html += folderPath
        .map((folderName, index) => {
            accumulatedPath += (index === 0 ? '' : '/') + folderName;
            const isLast = index === folderPath.length - 1;

            return `<li class="breadcrumb-item fs-3 d-inline-flex align-items-center ${isLast ? 'active' : ''}">
                        <button class="btn fs-3 border-0" data-folder-path="${accumulatedPath}">${folderName}</button>
                    </li>`;
        })
        .join('');

    container.innerHTML = html;
};

export default renderBreadcrumb;
