import React from 'react'
import RecordListItem from './RecordListItem'
import RecordListHead from './RecordListHead'

class RecordList extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let recordRows = []
        let records = this.props.selectedNav.records
        if (records) {
            recordRows = records.map((record, index) => {
                return <RecordListItem
                    key={index}
                    values={record}
                    handleClick={() => {
                        this.props.handleClick(record)
                    }}
                />
            })
        }

        return (
            <tbody>
            <RecordListHead navName={this.props.selectedNav.navName}/>
            {recordRows}
            </tbody>
        )
    }

}

export default RecordList