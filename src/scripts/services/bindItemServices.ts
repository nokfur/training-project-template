import renderGrid from '../components/_grid';
import bindBreadCrumbService from './_breadCrumbService';
import bindRowService from './_rowService';

const bindItemServices = () => {
    bindBreadCrumbService();
    bindRowService();
};

export default bindItemServices;
