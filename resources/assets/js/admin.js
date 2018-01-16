require('./bootstrap');
import React from 'react';
import {render} from 'react-dom';

import AdminRoutes from './routes/AdminRoutes';

// Global variable
window.systemName = 'admin'

render(
    <AdminRoutes/>
    , document.querySelector('#content')
);