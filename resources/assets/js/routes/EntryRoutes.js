// import libs
import React from 'react'
import {BrowserRouter,Switch,Route} from 'react-router-dom'
// import components
import A1 from "../components/entry/A1";
import A2 from "../components/entry/A2";
import A3 from "../components/entry/A3";
import A4 from "../components/entry/A4";
import A5 from "../components/entry/A5";
import A6 from "../components/entry/A6";
import A7 from "../components/entry/A7";
import Unauthorized from "../components/extras/Unauthorized";
import UsedCompanyIDNotFound from "../components/extras/UsedCompanyIDNotFound";

const EntryRoutes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/:usedCompanyId/entry/index" component={A1}/>
            <Route path="/:usedCompanyId/entry/a2" component={A2}/>
            <Route path="/:usedCompanyId/entry/a3" component={A3}/>
            <Route path="/:usedCompanyId/entry/a4" component={A4}/>
            <Route path="/:usedCompanyId/entry/a5" component={A5}/>
            <Route path="/:usedCompanyId/entry/a6" component={A6}/>
            <Route path="/:usedCompanyId/entry/a7" component={A7}/>
            <Route path='/:usedCompanyId/entry/unauthorized' component={Unauthorized}/>
            <Route path="/:usedCompanyId/entry/company-id-not-found" component={UsedCompanyIDNotFound}/>
        </Switch>
    </BrowserRouter>
);

export default EntryRoutes