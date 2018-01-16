require('./bootstrap');
import React from 'react';
import {render} from 'react-dom';

import PasswordRoutes from './routes/PasswordRoutes'

render(
    <PasswordRoutes/>
    , document.querySelector('#content')
);