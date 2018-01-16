import React from 'react'
import ReactTimeout from 'react-timeout'
import {
    RECEPTION_PHONE_ID, RECEPTION_PHONE_NUMBER,
} from "../../constants/table_column_names";
import {TIME_OUT} from "../../constants/fixed_numbers";
import {isEmpty, isValidTel, isValidTelChars} from "../validation/validations";
import {filterPhoneNumber, formatPhoneNumber, toHalfWidth} from "../../utils/transformers";
import {getLastId, registerReceptionPhoneNumber, updateReceptionPhoneNumber} from "../../services/ajax_services";
import {dataChangedAlert} from "../extras/data_changed_alert";
import BaseABScreen from "./BaseABScreen";

class C7 extends BaseABScreen {
    constructor(props) {
        super(props);

        this.msg = {
            e0002: '',
            e0008: ''
        };

        this.state = {
            receptionPhone: {
                [RECEPTION_PHONE_ID]: '',
                [RECEPTION_PHONE_NUMBER]: '',
            },
            hasEmptyField: false,
            invalidTelChars: false,
            invalidTel: false
        };

        this.handlePhoneNumberInput = this.handlePhoneNumberInput.bind(this)
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
        let msg = JSON.parse(sessionStorage.getItem('messages'));
        if (msg) {
            this.msg.e0002 = msg.e0002;
            this.msg.e0008 = msg.e0008
        } else
            this.props.history.push('index');
        if (!this.isRegisterPage)
            this.setState({receptionPhone: this.props.location.state.selectedRecord});
        else
            getLastId('reception-phone').then(lastId => {
                if (!isEmpty(lastId))
                    this.setState(prevState => {
                        return {receptionPhone: {...prevState.receptionPhone, [RECEPTION_PHONE_ID]: lastId}}
                    });
                else
                    this.props.history.goBack()
            });
        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }

    handlePhoneNumberInput(value) {
        this.setState(prevState => {
            return {
                receptionPhone: {...prevState.receptionPhone, [RECEPTION_PHONE_NUMBER]: value},
                invalidTel: false,
                invalidTelChars: false
            }
        });
        if (this.submitClicked)
            this.validateEmptyField(value);
        if (!isEmpty(value))
            this.validatePhoneNumber(value)
    }

    validateEmptyField(value) {
        const status = isEmpty(value);
        this.setState({hasEmptyField: status});
        return !status
    }

    validatePhoneNumber(phoneNumber) {
        phoneNumber = toHalfWidth(phoneNumber);
        let validTelChars = isValidTelChars(phoneNumber);
        this.setState({invalidTelChars: !validTelChars});
        if (validTelChars) {
            let formattedPhoneNumber = formatPhoneNumber(phoneNumber);
            this.setState(prevState => {
                return {receptionPhone: {...prevState.receptionPhone, [RECEPTION_PHONE_NUMBER]: formattedPhoneNumber}}
            });
            let validPhoneNumber = isValidTel(phoneNumber);
            this.setState({invalidTel: !validPhoneNumber});
            return validPhoneNumber
        }
        return validTelChars
    }

    alertResult(status) {
        dataChangedAlert(this.isRegisterPage, 'reception phone number', status);
        if (status === true)
            this.props.history.goBack();
        else
            this.submitBtn.attr('disabled', false);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        this.submitClicked = true;
        let receptionPhone = this.state.receptionPhone;
        if (this.validateEmptyField(receptionPhone[RECEPTION_PHONE_NUMBER]) &&
            this.hasFormChanged &&
            this.validatePhoneNumber(receptionPhone[RECEPTION_PHONE_NUMBER])) {

            receptionPhone[RECEPTION_PHONE_NUMBER] = filterPhoneNumber(toHalfWidth(receptionPhone[RECEPTION_PHONE_NUMBER]));
            if (this.isRegisterPage) {
                registerReceptionPhoneNumber(receptionPhone)
                    .then(status => this.alertResult(status))
            } else {
                updateReceptionPhoneNumber(receptionPhone)
                    .then(status => this.alertResult(status))
            }
        } else {
            this.submitBtn.attr('disabled', false);
        }
    }

    handleTimeout() {
        this.props.history.push(`index`);
    }

    render() {
        return (
            <main className="admin-main">
                <form className="form-control" onSubmit={this.handleSubmit.bind(this)}>
                    <p className="error">
                        <span hidden={!this.state.hasEmptyField}>氏名 {this.msg.e0002}</span>
                        <span hidden={!this.state.invalidTelChars}>氏名 {this.msg.e0008}</span>
                        <span hidden={!this.state.invalidTel}>有効な電話番号を入力して下さい。</span>
                    </p>
                    <dl className="admin-form" onChange={() => this.hasFormChanged = true}>
                        <dt>受付電話ID</dt>
                        <dd>{this.state.receptionPhone[RECEPTION_PHONE_ID]}</dd>
                        <dt><label htmlFor="admin7-tel">受付電話番号</label></dt>
                        <dd><input type="tel"
                                   id="admin7-tel"
                                   maxLength={100}
                                   value={this.state.receptionPhone[RECEPTION_PHONE_NUMBER]}
                                   onChange={(e) => this.handlePhoneNumberInput(e.target.value)}/></dd>
                        <input type="submit"
                               className={this.isRegisterPage ? 'btn-submit u-mgt30' : 'btn-edit'}
                               value={this.isRegisterPage ? '新規登録' : '変更'}/>
                    </dl>
                </form>
            </main>
        )
    }
}

export default ReactTimeout(C7)