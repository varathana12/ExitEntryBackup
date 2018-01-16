import React, {Component} from 'react';
import ReactTimeout from 'react-timeout'
import {filterPhoneNumber, toHalfWidth} from "../../utils/transformers";
import {isEmpty} from "../validation/validations";
import {COMPANY_NAME, EMAIL_ADDRESS, MEMBER_ID, NAME, PHONE_NUMBER} from "../../constants/table_column_names";
import {getVisitor, registerVisitor, updateVisitor} from "../../services/ajax_services";
import BaseEntry from "./BaseEntry";

class A5 extends BaseEntry {
    constructor(props) {
        super(props);

        this.state = {
            [MEMBER_ID]: '',
            [COMPANY_NAME]: '',
            [NAME]: '',
            [EMAIL_ADDRESS]: '',
            [PHONE_NUMBER]: ''
        };

        this.handleReturn = this.handleReturn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.putMemberId = this.putMemberId.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('visitor')))
            this.props.history.push('index');
    }

    componentDidMount() {
        let visitor = sessionStorage.getItem('visitor');
        if (!isEmpty(visitor)) {
            visitor = JSON.parse(visitor);
            this.setState(visitor)
        }
        this.props.setTimeout(this.handleTimeout, 300000);
    }

    handleSubmit(e) {
        e.preventDefault();
        let memberId = this.state[MEMBER_ID];
        let visitor = this.state

        visitor[COMPANY_NAME] = toHalfWidth(visitor[COMPANY_NAME])
        visitor[NAME] = toHalfWidth(visitor[NAME])
        visitor[EMAIL_ADDRESS] = toHalfWidth(visitor[EMAIL_ADDRESS]).toLowerCase()
        visitor[PHONE_NUMBER] = filterPhoneNumber(toHalfWidth(visitor[PHONE_NUMBER]))

        if (!isEmpty(memberId)) {
            updateVisitor(visitor)
                .then(status => {
                    if (status === 401)
                        this.props.history.push('unauthorized')
                    else if (status === true)
                        this.props.history.push(`a6${window.token}`);
                })
        } else {
            registerVisitor(visitor)
                .then(status => {
                    if (status === 401)
                        this.props.history.push('unauthorized')
                    else if (status === true) {
                        this.putMemberId(visitor)
                            .then(status => {
                                if (status === true)
                                    this.props.history.push(`a6${window.token}`)
                            })
                    }
                })
        }
    }

    handleReturn(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    putMemberId(visitor) {
        return getVisitor(visitor[EMAIL_ADDRESS])
            .then(data => {
                if (data === 401)
                    this.props.history.push('unauthorized')

                let status = !isEmpty(data)
                if (status === true) {
                    sessionStorage.setItem('visitor', JSON.stringify(data));
                }
                return status
            })
    }

    handleTimeout() {
        this.props.history.push(`index${window.token}`);
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="enter-p">下記の情報で登録してよろしいでしょうか？</p>
                    <form className="form-control">
                        <div className="box-gray">
                            {this.state[COMPANY_NAME]}<br/>
                            {this.state[NAME]} 様<br/>
                            {this.state[EMAIL_ADDRESS]}<br/>
                            {this.state[PHONE_NUMBER]}
                        </div>
                        <div className="btn-group enter-btn">
                            <button form="" className="btn-s-sub" onClick={this.handleReturn}>戻る</button>
                            <input type="submit" className="btn-s-main" value="登録" onClick={this.handleSubmit}/>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(A5)