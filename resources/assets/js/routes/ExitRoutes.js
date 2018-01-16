import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import B1 from '../components/exit/B1'
import B2 from '../components/exit/B2'
import B3 from '../components/exit/B3'
import B4 from '../components/exit/B4'
import Unauthorized from '../components/extras/Unauthorized'
import UsedCompanyIDNotFound from "../components/extras/UsedCompanyIDNotFound";

const ExitRoutes = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/:usedCompanyId/exit/index' component={B1}/>
            <Route path='/:usedCompanyId/exit/b2' component={B2}/>
            <Route path='/:usedCompanyId/exit/b3' component={B3}/>
            <Route path='/:usedCompanyId/exit/b4' component={B4}/>
            <Route path='/:usedCompanyId/exit/unauthorized' component={Unauthorized}/>
            <Route path="/:usedCompanyId/exit/company-id-not-found" component={UsedCompanyIDNotFound}/>
        </Switch>
    </BrowserRouter>
);

export default ExitRoutes