import React from 'react'
import ReactTimeout from 'react-timeout'
import {EXIT_CONFIRMER_ID, ID_NAME} from "../../constants/table_column_names";
import {TIME_OUT} from "../../constants/fixed_numbers";
import {isEmpty} from "../validation/validations";
import {toHalfWidth} from "../../utils/transformers";
import {getLastId, registerExitConfirmer, updateExitConfirmer} from "../../services/ajax_services";
import {dataChangedAlert} from "../extras/data_changed_alert";
import BaseABScreen from "./BaseABScreen";

class C5 extends BaseABScreen {
    constructor(props) {
        super(props);

        this.msg = {
            e0002: ''
        };

        this.state = {
            exitConfirmer: {
                [EXIT_CONFIRMER_ID]: '',
                [ID_NAME]: ''
            },
            idNameExists: false,
            hasEmptyField: false
        };
        this.handleIdNameInput = this.handleIdNameInput.bind(this)
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
        if (msg)
            this.msg.e0002 = msg.e0002;
        else
            this.props.history.push('index');
        if (!this.isRegisterPage)
            this.setState({exitConfirmer: this.props.location.state.selectedRecord});
        else {
            getLastId('exit-confirmer').then(lastId => {
                if (!isEmpty(lastId))
                    this.setState(prevState => {
                        return {exitConfirmer: {...prevState.exitConfirmer, [EXIT_CONFIRMER_ID]: lastId}}
                    });
                else
                    this.props.history.goBack()
            })
        }
        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }

    handleIdNameInput(value) {
        this.setState(prevState => {
            return {
                exitConfirmer: {...prevState.exitConfirmer, [ID_NAME]: value},
                idNameExists: false
            }
        });
        if (this.submitClicked)
            this.validateEmptyField(value)
    }

    validateEmptyField(value) {
        const status = isEmpty(value);
        this.setState({hasEmptyField: status});
        return !status
    }

    alertResult(status) {
        this.setState({idNameExists: status === 'duplicated'}, () => {
            if (!this.state.idNameExists) {
                dataChangedAlert(this.isRegisterPage, 'exit confirmer', status);
                if (status === true)
                    this.props.history.goBack();
                else
                    this.submitBtn.attr('disabled', false);
            } else
                this.submitBtn.attr('disabled', false);
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        this.submitClicked = true;
        let exitConfirmer = this.state.exitConfirmer;
        if (this.validateEmptyField(exitConfirmer[ID_NAME]) && this.hasFormChanged) {
            exitConfirmer[ID_NAME] = toHalfWidth(exitConfirmer[ID_NAME]);
            if (this.isRegisterPage) {
                registerExitConfirmer(exitConfirmer)
                    .then(status => this.alertResult(status))
            } else {
                updateExitConfirmer(exitConfirmer)
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
                        <span hidden={!this.state.idNameExists}>こちらの確認者は既に登録されています。</span>
                    </p>
                    <dl className="admin-form" onChange={() => this.hasFormChanged = true}>
                        <dt>退館確認者ID</dt>
                        <dd>{this.state.exitConfirmer[EXIT_CONFIRMER_ID]}</dd>
                        <dt><label htmlFor="admin5-name">氏名</label></dt>
                        <dd><input type="text"
                                   id="admin5-name"
                                   maxLength={100}
                                   value={this.state.exitConfirmer[ID_NAME]}
                                   onChange={(e) => this.handleIdNameInput(e.target.value)}/></dd>
                        <input type="submit"
                               className={this.isRegisterPage ? 'btn-submit u-mgt30' : 'btn-edit'}
                               value={this.isRegisterPage ? '新規登録' : '変更'}/>
                    </dl>
                </form>
            </main>
        )
    }
}

export default ReactTimeout(C5)