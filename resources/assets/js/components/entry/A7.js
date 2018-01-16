import React, {Component} from 'react';
import ReactTimeout from 'react-timeout';
import {isEmpty} from "../validation/validations";
import {MEMBER_ID, NUMBER_OF_VISITOR, RECEPTION_PHONE_NUMBER} from "../../constants/table_column_names";
import BaseEntry from "./BaseEntry";
import {registerEntryExitInfo} from "../../services/ajax_services";

class A7 extends BaseEntry {
    constructor(props) {
        super(props);

        this.state = {
            [MEMBER_ID]: '',
            [NUMBER_OF_VISITOR]: undefined,
            ready: false,
            isClick: true
        };
        this.handleCreate = this.handleCreate.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('visitor')) || isEmpty(sessionStorage.getItem(NUMBER_OF_VISITOR)))
            this.props.history.push(`index${window.token}`);
    }

    componentDidMount() {
        let visitor = sessionStorage.getItem('visitor');
        let numberOfVisitor = sessionStorage.getItem(NUMBER_OF_VISITOR);
        if (visitor && numberOfVisitor) {
            visitor = JSON.parse(visitor);

            this.setState({
                [MEMBER_ID]: visitor[MEMBER_ID],
                [NUMBER_OF_VISITOR]: numberOfVisitor,
                ready: true
            });
        }
        this.props.setTimeout(this.handleTimeout, 300000);
    }

    handleCreate() {

        if (this.state.ready) {
            if (this.state.isClick) {
                this.setState({isClick: false});
                registerEntryExitInfo({
                    [MEMBER_ID]: this.state[MEMBER_ID],
                    [NUMBER_OF_VISITOR]: this.state[NUMBER_OF_VISITOR]
                })
                    .then(status => {
                            if (status === 401)
                                this.props.history.push('unauthorized')
                            else if (status === true) {
                                window.location.href = sessionStorage.getItem([RECEPTION_PHONE_NUMBER]);
                                this.props.history.push(`index${window.token}`)
                            } else
                                this.setState({isClick: true})
                        }
                    )
            }

        }
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    handleReturn(e) {
        e.preventDefault();
        this.props.history.goBack();
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
                    <p className="enter-p">同時に入館される方の人数は<br/>
                        下記でよろしいでしょうか？</p>
                    <form className="form-control" onSubmit={this.handleSubmit}>
                        <div className="box-gray">
                            代表者含め<br/>
                            {this.state[NUMBER_OF_VISITOR]} 人<br/>
                        </div>
                        <p>問題なければ、受付に電話をかけます。</p>
                        <div className="btn-group enter-btn">
                            <button className="btn-s-sub" onClick={this.handleReturn}>戻る</button>
                            <a onClick={this.handleCreate}
                               className="btn-s-main">電話する</a>
                        </div>
                    </form>
                </main>
            </div>

        )
    }
}

export default ReactTimeout(A7)