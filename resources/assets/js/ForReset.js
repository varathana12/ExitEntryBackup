require('./bootstrap');
import React from 'react';
import {render} from 'react-dom';

import FormReset from './auth/FormReset';

render(
    <FormReset/>
    , document.querySelector('#content')
);