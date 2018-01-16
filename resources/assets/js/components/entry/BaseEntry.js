import React from 'react'
import BaseComponent from "../BaseComponent";
import {tryAuth} from "../../services/ajax_services";

class BaseEntry extends BaseComponent {
    constructor(props) {
        super(props);

        tryAuth().then(status => {
            if (status === 401)
                this.props.history.push('unauthorized');
            else if (status === 404)
                this.props.history.push('company-id-not-found');
        })
    }
}

export default BaseEntry