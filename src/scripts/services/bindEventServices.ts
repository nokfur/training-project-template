import bindBreadCrumbService from './_breadCrumbService';
import bindNavService from './_navService';
import bindRowService from './_rowService';

const bindEventServices = () => {
    bindNavService();
    bindBreadCrumbService();
    bindRowService();
};

export default bindEventServices;
