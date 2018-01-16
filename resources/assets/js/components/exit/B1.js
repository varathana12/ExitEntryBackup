import React from 'react'
import moment from 'moment'
import '../../../../../node_modules/remodal/dist/remodal.min.js'

import VisitorList from './VisitorList'
import {tryAuth} from "../../services/ajax_services"
import {COMPANY_NAME, MEMBER_ID, NAME, NUMBER_OF_VISITOR} from "../../constants/table_column_names";
import BaseExit from "./BaseExit";

class B1 extends BaseExit {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            visitors: [],
            selectedVisitor: {
                visitor: {
                    [COMPANY_NAME]: '',
                    [NAME]: '',
                },
                [MEMBER_ID]: '',
                [NUMBER_OF_VISITOR]: ''
            }
        };

        this.getInHallVisitors = this.getInHallVisitors.bind(this);
        this.updateVisitorList = this.updateVisitorList.bind(this);
        this.handleLeaveNow = this.handleLeaveNow.bind(this);
        this.handleEnterAnotherTime = this.handleEnterAnotherTime.bind(this);
    }

    componentDidMount() {
        this.updateVisitorList()
        sessionStorage.clear();
        this.modal = $('[data-remodal-id=modal]').remodal({hashTracking: false});
    }

    componentWillUnmount() {
        this.modal.destroy();
    }

    updateVisitorList() {
        this.getInHallVisitors().then(visitors => {
            this.setState({visitors: visitors});
        })
    }

    handleLeaveNow() {
        sessionStorage.setItem('exit_time', moment().format('hh:mm:ss'));
        sessionStorage.setItem(MEMBER_ID, this.state.selectedVisitor[MEMBER_ID]);
        this.props.history.push(`b3${window.token}`);
    }

    getInHallVisitors() {
        return axios.get('/exit/get-in-hall-visitors')
            .then(response => response.data)
            .catch(error => {
                if (error.response.status === 401)
                    this.props.history.push('unauthorized')
                // console.error(error)
            })
    }

    handleEnterAnotherTime() {
        sessionStorage.setItem(MEMBER_ID, this.state.selectedVisitor[MEMBER_ID]);
        if(sessionStorage.getItem(MEMBER_ID)){
            this.props.history.push(`b2${window.token}`);
        }
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p>退館された方の退館ボタンを<br/>
                        押してください。</p>
                    <button className="btn-sp-sub u-fright" onClick={this.updateVisitorList}>情報更新</button>
                    <VisitorList
                        visitors={this.state.visitors}
                        handleSelectVisitor={selectedVisitor => this.setState({selectedVisitor: selectedVisitor})}/>
                </main>
                {/*============= ▼Modal =============*/}
                <div data-remodal-id="modal">
                    <p className="box-gray">{this.state.selectedVisitor.visitor[COMPANY_NAME]}<br/>
                        {this.state.selectedVisitor.visitor[NAME]}<br/>
                        (他{this.state.selectedVisitor[NUMBER_OF_VISITOR]}名)</p>
                    <p className="exit-p">こちらの来訪者を現時刻で<br/>
                        退館としますが、よろしいですか？</p>
                    <div className="btn-group">
                        <button className="btn-s-sub" data-remodal-action="close">いいえ</button>
                        <button className="btn-s-main" onClick={this.handleLeaveNow}>はい</button>
                        <button className="btn-sub" onClick={this.handleEnterAnotherTime}>別の時刻を入力する</button>
                    </div>
                </div>
                {/*============= ▲Modal =============*/}
            </div>
        )
    }
}

export default B1