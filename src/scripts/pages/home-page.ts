import ready from '../utilities/_helper';
import renderGrid from '../components/_grid';
import 'bootstrap';
import bindOneTimeServices from '../services/bindOneTimeServices';

ready(() => {
    bindOneTimeServices();
    renderGrid();
});
