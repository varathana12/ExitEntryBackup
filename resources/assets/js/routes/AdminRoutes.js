import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import Main from '../components/admin/Main'

const AdminRoutes = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/:usedCompanyId/admin/login'/>
            <Route path='/:usedCompanyId/admin/reset-password'/>
            <Route path='/admin' component={Main}/>
        </Switch>
    </BrowserRouter>
);

export default AdminRoutes