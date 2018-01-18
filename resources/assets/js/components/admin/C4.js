import React from 'react'
import ReactTimeout from 'react-timeout'
import {isOverHundred, isEmpty, isMatch, isUnique} from "../validation/validations";
import {toHalfWidth} from "../../utils/transformers";
import {dataChangedAlert} from "../extras/data_changed_alert";
import moment from 'moment'

window.jQuery = require('jquery');
require('../../lib/jquery-ui.min')
require('../../lib/jquery.ui.datepicker-ja.min')
require('../../lib/jquery.datetimepicker')
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import {
    MEMBER_ID
    , COMPANY_NAME
    , NAME
    , EXIT_CONFIRMER_ID
    , ID_NAME
    , ENTRY_DATETIME
    , EXIT_DATETIME
    , NUMBER_OF_VISITOR, ENTRY_EXIT_INFORMATION_ID
} from "../../constants/table_column_names";
import {Visitors,Confirmers} from "./list-components/ListVisitors";
import {TIME_OUT} from "../../constants/fixed_numbers";

import {getAllVisitorInHall, getAllExitConfirmer, getAllVisitors} from "../../services/ajax_services";


import {isInHall} from "../validation/validations";
import BaseABScreen from "./BaseABScreen";

class C4 extends BaseABScreen {
    constructor(props) {
        super(props)
        this.isRegisterPage = true

        this.msg = {
            e0002: '',
            e0007: '',
        }
        this.state = {
            list: [],
            confirm_person: [],
            visitorInHall: [],
            [MEMBER_ID]: '',
            [EXIT_CONFIRMER_ID]: '',
            [ENTRY_DATETIME]: '',
            [EXIT_DATETIME]: '',
            [ENTRY_EXIT_INFORMATION_ID]: '',
            [NUMBER_OF_VISITOR]: 1,
            validMemberId: {
                status: true,
                message: ''
            },
            validConfirmId: {
                status: true,
                message: ''
            },
            validEntryDateTime: {
                status: true,
                message: ''
            },
            validExitDateTime: {
                status: true,
                message: ''
            },
            submitMessage: '',
            visitor: {},
            isSubmit: false,
        }

        this.handleAmountPeople = this.handleAmountPeople.bind(this)
        this.handleDateEntry = this.handleDateEntry.bind(this)
        this.handleDateExit = this.handleDateExit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleData = this.handleData.bind(this)
        this.handleVisitor = this.handleVisitor.bind(this);
        this.handleConfirmer = this.handleConfirmer.bind(this)

    }

    componentWillMount() {
        try {
            this.isRegisterPage = !this.props.location.state.selectedRecord;
        }
        catch (e) {
            this.props.history.push('index');
        }
    }

    componentDidMount() {
        let msg = JSON.parse(sessionStorage.getItem('messages'))
        this.msg.e0002 = msg.e0002
        this.msg.e0007 = msg.e0007
        if (this.isRegisterPage) {
            this.setState({validMemberId: {status: false, message: "会員ID" + this.msg.e0002}})
            this.setState({validEntryDateTime: {status: false, message: '入館日時' + this.msg.e0002}})
        }
        $("#admin4-enter").datetimepicker({
            format: 'Y-m-d H:i',
            formatTime: 'H:i',
            formatDate: 'Y-m-d',

        });

        this.handleData();

        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }
    handleVisitor (selectedVistor){

            this.setState({ [MEMBER_ID]:parseInt(`${selectedVistor.value}`)},function () {
                if($("#selectedVisitor span.Select-value-label")[0])
                    $("#selectedVisitor span.Select-value-label")[0].innerHTML = `${selectedVistor.value}`

                if(isInHall(this.state.visitorInHall, parseInt(`${selectedVistor.value}`)))
                    this.setState({validMemberId: {status: false, message: "「こちらのメールアドレスでは現在、入館できません。」"}})
                else
                    this.setState({validMemberId: {status: true, message: ""}})

            });

    }

    handleConfirmer(selectedConfirmer){
        this.setState({ [EXIT_CONFIRMER_ID]:parseInt(`${selectedConfirmer.value}`)},function () {
            if($("#selectedConfirmer span.Select-value-label")[0])
                $("#selectedConfirmer span.Select-value-label")[0].innerHTML = `${selectedConfirmer.value}`

            this.setState({validConfirmId: {status: true, message: ""}})
        });
    }

    handleData(e){
        getAllVisitors().then(data => this.setState({list: data}))
        getAllExitConfirmer().then(data => {
            this.setState({confirm_person: data.data})
            if (!this.isRegisterPage)
                    this.handleUpdate()
            })
        if (this.isRegisterPage)
                getAllVisitorInHall().then(visitorInHall => this.setState({visitorInHall: visitorInHall}))
    }

    handleUpdate(e) {

        let data = this.props.location.state.selectedRecord;
        let dateExit = '';
        let confirmer_id = ''
        let member_id = data[MEMBER_ID]
        let number_of_visitor = data[NUMBER_OF_VISITOR];
        let dateEntry = data[ENTRY_DATETIME].split(':')[0] + ":" + data[ENTRY_DATETIME].split(':')[1]
        if (!isEmpty(data[EXIT_DATETIME]))
                dateExit = data[EXIT_DATETIME].split(':')[0] + ":" + data[EXIT_DATETIME].split(':')[1]
                this.setState({validExitDateTime: {status: true, message: ''}})

        if (!isEmpty(data[EXIT_CONFIRMER_ID]))
            confirmer_id = data[EXIT_CONFIRMER_ID]
        else
            confirmer_id = ''
        this.setState({
            [MEMBER_ID]: member_id
            , [NUMBER_OF_VISITOR]: number_of_visitor
            , [ENTRY_DATETIME]: dateEntry
            , [EXIT_DATETIME]: dateExit
            , [EXIT_CONFIRMER_ID]: confirmer_id
            , [ENTRY_EXIT_INFORMATION_ID]: data[ENTRY_EXIT_INFORMATION_ID]
            , validMemberId: {status: true, message: ''}
            , validEntryDateTime: {status: true, message: ''}
        },function () {
                if ($("#selectedConfirmer span.Select-value-label")[0])
                    $("#selectedConfirmer span.Select-value-label")[0].innerHTML = confirmer_id
                if ($("#selectedVisitor span.Select-value-label")[0])
                    $("#selectedVisitor span.Select-value-label")[0].innerHTML = member_id
            }
        )

        $("#admin4-exit").datetimepicker({
            format: 'Y-m-d H:i',
            formatTime: 'H:i',
            formatDate: 'Y-m-d',
            minDate: dateEntry.split(' ')[0]

        });

    }

    handleAmountPeople(e) {
        this.setState({[NUMBER_OF_VISITOR]: parseInt( e.target.value)});
    }

    handleDateEntry(e) {
        let datetime = e.target.value;
        this.setState({[ENTRY_DATETIME]: datetime})
        if (datetime >= this.state[EXIT_DATETIME])
                this.setState({[EXIT_DATETIME]: ''})
        $("#admin4-exit").datetimepicker({
            format: 'Y-m-d H:i',
            formatTime: 'H:i',
            formatDate: 'Y-m-d',
            minDate: datetime.split(' ')[0]
        });
        if (isEmpty(datetime)) {
            this.setState({
                validEntryDateTime: {
                    status: false,
                    message: '入館日時' + this.msg.e0002
                }
            })
        }
        else {
            this.setState({
                validEntryDateTime: {
                    status: true,
                    message: ''
                }
            })
        }
    }

    handleDateExit(e) {
        let datetime = toHalfWidth(e.target.value);
        this.setState({[EXIT_DATETIME]: datetime})
        if (datetime <= this.state[ENTRY_DATETIME])
                this.setState({[EXIT_DATETIME]: ''})
    }

    alertResult(status) {
        dataChangedAlert(this.isRegisterPage, 'Entry Exit Information', status);
        if (status === true)
            this.props.history.goBack();
        else
            this.submitBtn.attr('disabled', false);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        this.setState({isSubmit: true});
        console.log(this.hasFormChanged)
        if (this.state.validMemberId.status
            && this.state.validEntryDateTime.status
            && this.state.validExitDateTime.status
            && this.state.validConfirmId.status
            ) {

            if (!this.isRegisterPage) {
                axios.post('/admin/entry-exit-info/update_entry_visitor', {
                    [ENTRY_EXIT_INFORMATION_ID]: this.state[ENTRY_EXIT_INFORMATION_ID],
                    [NUMBER_OF_VISITOR]: this.state[NUMBER_OF_VISITOR],
                    [ENTRY_DATETIME]: this.formatTime(this.state[ENTRY_DATETIME]),
                    [EXIT_DATETIME]: this.formatTime(this.state[EXIT_DATETIME]),
                    [EXIT_CONFIRMER_ID]: this.state[EXIT_CONFIRMER_ID]
                })
                    .then((response) => this.alertResult(response.data.status))
                    .catch(error => console.log(error));
            } else {
                axios.post('/admin/entry-exit-info/entry_visitor', {
                    [MEMBER_ID]: this.state[MEMBER_ID],
                    [NUMBER_OF_VISITOR]: this.state[NUMBER_OF_VISITOR],
                    [ENTRY_DATETIME]: this.formatTime(this.state[ENTRY_DATETIME]),
                    [EXIT_DATETIME]: this.formatTime(this.state[EXIT_DATETIME]),
                    [EXIT_CONFIRMER_ID]: this.state[EXIT_CONFIRMER_ID]
                }).then((response) => this.alertResult(response.data.status))
                    .catch(error =>console.log(error));
                }
        } else {
            this.submitBtn.attr('disabled', false);
        }
    }

    formatTime(dateTime) {
        if (dateTime == '')
                return 'null'
        let now = new moment();
        let time = dateTime + now.format(":ss");
        return time;
    }

    generateDate() {
        let data = [];
        for (let i = 1; i <= 100; i++) {
            data.push({key: i, name: i + ' 人'});
        }
        return data;
    }

    handleTimeout() {
        this.props.history.push(`index`);
    }


    render() {

        const Amount = this.generateDate().map(item => {
            return (
                <option key={item.key} value={item.key}>{item.name}</option>
            )
        })



        return (
            <main className="admin-main">
                <form onSubmit={this.handleSubmit} className="form-control">
                    <p className="error" hidden={!this.state.isSubmit}>
                        {this.state.validMemberId.message}
                        {" " + this.state.validEntryDateTime.message}
                        {" " + this.state.validExitDateTime.message}
                        {" " + this.state.validConfirmId.message}
                    </p>
                    <dl className="admin-form" onChange={() => this.hasFormChanged = true}>
                        <dt><label htmlFor="admin4-id">会員ID</label></dt>
                        <dd id={'selectedVisitor'}>
                            <Select
                            name="form-field-name"
                            disabled={!this.isRegisterPage}
                            placeholder={"会社名または氏名を入力すると絞り込めます。"}
                            value={this.state[MEMBER_ID]}
                            onChange={this.handleVisitor}
                            options={Visitors(this.state.list)}

                            />
                        </dd>
                        <dt><label htmlFor="admin4-count">入館人数</label></dt>
                        <dd>
                            <select id="admin4-count"
                                    value={this.state[NUMBER_OF_VISITOR]}
                                    onChange={this.handleAmountPeople}>
                                {Amount}
                            </select>
                        </dd>
                        <dt><label htmlFor="admin4-enter">入館日時</label></dt>
                        <dd><input type="text" id="admin4-enter"
                                   onBlur={this.handleDateEntry}
                                   value={this.state[ENTRY_DATETIME]}
                                   className="datepicker"
                                   maxLength={100}/></dd>
                        <dt><label htmlFor="admin4-exit">退館日時</label></dt>
                        <dd><input type="text" id="admin4-exit"
                                   onBlur={this.handleDateExit}
                                   value={this.state[EXIT_DATETIME]}
                                   className="datepicker"
                                   maxLength={100}/></dd>
                        <dt><label htmlFor="admin4-confirm">退館確認者ID</label></dt>
                        <dd  id={'selectedConfirmer'}>
                            <Select
                                name="form-field-name"
                                placeholder={""}
                                value={this.state[EXIT_CONFIRMER_ID]}
                                onChange={this.handleConfirmer}
                                options={Confirmers(this.state.confirm_person)}
                            />
                        </dd>
                        <input type="submit"
                               className={this.isRegisterPage ? 'btn-submit' : 'btn-edit'}
                               value={this.isRegisterPage ? '新規登録' : '変更'}/>
                    </dl>
                </form>
            </main>
        )
    }
}

export default ReactTimeout(C4)