import bindServices from '../services/bindServices';
import renderBreadcrumb from './_breadCrumb';
import renderTableData from './_tableData';

const renderGrid = async () => {
    // TODO: implement code to Render grid
    await renderTableData();
    renderBreadcrumb();

    // init event listeners
    bindServices();
};

export default renderGrid;
