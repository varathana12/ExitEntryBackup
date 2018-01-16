import {TOKEN} from "./constants/table_column_names";

require('./bootstrap');
import React from 'react';
import {render} from 'react-dom';

import EntryRoutes from './routes/EntryRoutes';

// Global token variables
window.token = null;
window.systemName = 'entry';
// This is our for attaching the exit token to every HTTP outgoing requests.
// acquire the token key from url's query string parameter
window.queryString = require('query-string');

let params = window.queryString.parse(location.search);

if (params) {
    window.axios.defaults.headers.common[TOKEN] = params[TOKEN];
    window.token = `?token=${params[TOKEN]}`;
}

render(
    <EntryRoutes/>
    , document.querySelector('#content')
);