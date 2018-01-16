import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Email from '../auth/Email'
import Success from '../auth/Success'
const PasswordRoutes = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/reset/email' component={Email}/>
            <Route path='/reset/success' component={Success}/>
        </Switch>
    </BrowserRouter>
);

export default PasswordRoutes