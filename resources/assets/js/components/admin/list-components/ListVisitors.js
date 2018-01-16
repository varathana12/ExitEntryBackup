import React from 'react'
import {MEMBER_ID,NAME,COMPANY_NAME,EXIT_CONFIRMER_ID,ID_NAME} from "../../../constants/table_column_names";

export const Visitors = (visitors)=>{
    let visitor = []
    visitor = visitors.map(item => {
        let option ={value:item[MEMBER_ID]
            ,label:item[COMPANY_NAME] + " " + item[NAME] + " " + item[MEMBER_ID]}

        return option
    })
    return visitor
}

export const Confirmers = (confirmers)=>{
    let confirmer =[]
    confirmer = confirmers.map(item => {
            let option ={value:item[EXIT_CONFIRMER_ID],label:item[ID_NAME]}
            return option

    })
    return confirmer;
}