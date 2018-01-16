import React from 'react'
import {Switch, Route} from 'react-router-dom'

import {getMessages} from "../../services/ajax_services";

import NavBar from './NavBar'
import C2 from "./C2";
import C3 from "./C3";
import C4 from './C4'

import C5 from "./C5";
import C6 from './C6'
import C7 from "./C7";
import C8 from './C8'
import BaseAdminComponent from "./BaseAdminComponent";

window.activePage = 0;

class Main extends BaseAdminComponent {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        getMessages()
    }

    render() {
        return (
            <div className="admin-flex">
                <NavBar history={this.props.history}/>
                <Switch>
                    <Route path='/admin/index' component={C2}/>
                    <Route path='/admin/c3' component={C3}/>
                    <Route path='/admin/c4' component={C4}/>
                    <Route path='/admin/c5' component={C5}/>
                    <Route path='/admin/c6' component={C6}/>
                    <Route path='/admin/c7' component={C7}/>
                    <Route path='/admin/c8' component={C8}/>
                </Switch>
            </div>
        )
    }
}

export default Main