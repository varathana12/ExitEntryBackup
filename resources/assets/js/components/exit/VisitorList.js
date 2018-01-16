import React from 'react'
import VisitorListItem from './VisitorListItem'
import {MEMBER_ID} from "../../constants/table_column_names";

const VisitorList = (props) => {
    let visitorItems = [];
    if (props.visitors)
        visitorItems = props.visitors.map(entryExitInfo => {
            return <VisitorListItem
                key={entryExitInfo[MEMBER_ID]}
                entryExitInfo={entryExitInfo}
                handleSelectVisitor={props.handleSelectVisitor}/>
        });

    return (
        <dl className="exit-dl">
            {visitorItems}
        </dl>
    )
};

export default VisitorList