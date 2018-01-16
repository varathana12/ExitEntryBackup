require('./bootstrap');
import React from 'react';
import {render} from 'react-dom';

import Login from './auth/Login';

render(
    <Login/>
    , document.querySelector('#content')
);