import ready from '../utilities/_helper';
import renderGrid from '../components/_grid';
import 'bootstrap';
import initialize from './_init';

ready(() => {
    renderGrid();
    initialize();
});
