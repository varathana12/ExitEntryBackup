import React from 'react'
import {NUMBER_OF_VISITOR, MEMBER_ID, NAME, COMPANY_NAME} from "../../constants/table_column_names";

const VisitorListItem = (props) => {
    return (
        <div>
            <dt>株式会社{props.entryExitInfo.visitor[COMPANY_NAME]}<br/>
                {props.entryExitInfo.visitor[NAME]}<br/>
                (他{props.entryExitInfo[NUMBER_OF_VISITOR]}名)
            </dt>
            <dd>
                <button className="btn-sp-main"
                        data-remodal-target="modal"
                        onClick={() => props.handleSelectVisitor(props.entryExitInfo)}>
                    退館
                </button>
            </dd>
        </div>
    )
};

export default VisitorListItem