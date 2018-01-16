import React, {Component} from 'react'
import Loading from './extras/Loading'
import {USED_COMPANY_ID} from "../constants/table_column_names";

Loading();

class BaseComponent extends Component {
    constructor(props) {
        super(props);

        window.axios.defaults.headers.common[USED_COMPANY_ID] = props.match.params.usedCompanyId;
    }
}

export default BaseComponent