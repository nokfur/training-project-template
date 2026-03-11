import bindItemServices from '../services/bindItemServices';
import renderBreadcrumb from './_breadCrumb';
import renderTableData from './_tableData';

const renderGrid = async () => {
    // TODO: implement code to Render grid
    await renderTableData();
    renderBreadcrumb();

    // init event listeners
    bindItemServices();
};

export default renderGrid;
