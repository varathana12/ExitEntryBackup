import React from 'react'
import {isEmpty} from "../../validation/validations";

class RecordListItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let cells = []
        let valueObj = this.props.values
        if (valueObj) {
            // let values = Object.values(props.values)  // not supported in IE
            let values = Object.keys(valueObj).map(e => valueObj[e])
            cells = values.map((value, index) => {
                if ((isEmpty(valueObj.entry_exit_information_id)) || (index !== 0))
                    return <td key={index}>{value}</td>
            })
        }
        return (
            <tr onClick={this.props.handleClick} className="c2-table-row">
                {cells}
            </tr>
        )
    }

}

export default RecordListItem