import React from 'react'
import ReactTimeout from 'react-timeout'
import {
    isEmpty, isExistingEmail, isValidEmail, isValidEmailChars
} from "../validation/validations";
import {toHalfWidth} from "../../utils/transformers";
import {getLastId, registerAdmin, updateAdmin} from "../../services/ajax_services";
import {
    ADMINISTRATOR_ID, PASSWORD, ADMINISTRATOR_EMAIL
} from "../../constants/table_column_names";
import {TIME_OUT} from "../../constants/fixed_numbers";
import {dataChangedAlert} from "../extras/data_changed_alert";
import BaseABScreen from "./BaseABScreen";

class C6 extends BaseABScreen {
    constructor(props) {
        super(props);

        this.msg = {
            e0002: '',
            e0007: '',
            e0010: ''
        };

        this.state = {
            admin: {
                [ADMINISTRATOR_ID]: '',
                [ADMINISTRATOR_EMAIL]: '',
                [PASSWORD]: '',
            },
            error: {
                hasEmptyFields: false,
                invalidEmail: false,
                invalidEmailChars: false,
                emailExists: false,
                invalidPassword: false
            },
            emptyFields: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.validateExistingEmail = this.validateExistingEmail.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.handleFocusPassword = this.handleFocusPassword.bind(this)
        this.handleBlurPassword = this.handleBlurPassword.bind(this)
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
            this.msg.e0007 = msg.e0007;
            this.msg.e0010 = msg.e0010
        } else
            this.props.history.push('index');
        if (!this.isRegisterPage)
            this.setState({admin: {...this.props.location.state.selectedRecord, [PASSWORD]: '********'}});
        else {
            getLastId('admin').then(lastId => {
                if (!isEmpty(lastId))
                    this.setState(prevState => {
                        return {admin: {...prevState.admin, [ADMINISTRATOR_ID]: lastId}}
                    });
                else
                    this.props.history.goBack()
            })
        }
        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }

    handlePasswordInput(password) {
        this.passwordChanged = true;
        this.setState({
                admin: {...this.state.admin, [PASSWORD]: password},
                error: {...this.state.error, invalidPassword: false}
            },
            () => {
                if (this.submitClicked)
                    this.validateEmptyFields(this.state.admin)
            }
        );
        if (!isEmpty(password))
            this.validatePassword(password)
    }

    handleEmailInput(email) {
        this.setState(prevState => {
            return {
                admin: {...prevState.admin, [ADMINISTRATOR_EMAIL]: email},
                error: {...prevState.error, invalidEmail: false, invalidEmailChars: false, emailExists: false}
            }
        }, () => {
            if (this.submitClicked)
                this.validateEmptyFields(this.state.admin)
        });
        // Email validation
        if (!isEmpty(email))
            this.validateEmail(email)
    }

    validatePassword(password) {
        let validPassword = !(password.length < 8 || isEmpty(password));
        this.setState(prevState => {
            return {error: {...prevState.error, invalidPassword: !validPassword}}
        });
        return validPassword
    }

    validateEmail(email) {
        const validEmailChars = isValidEmailChars(email);
        this.setState(prevState => {
            return {error: {...prevState.error, invalidEmailChars: !validEmailChars}}
        });
        if (validEmailChars) {
            const validEmail = isValidEmail(email);
            this.setState(prevState => {
                return {error: {...prevState.error, invalidEmail: !validEmail}}
            });
            return validEmail
        }
        return validEmailChars
    }

    validateExistingEmail(admin) {
        if (!this.state.error.invalidEmail && !isEmpty(admin[ADMINISTRATOR_EMAIL])) {
            return isExistingEmail({model: 'admin', id: admin[ADMINISTRATOR_ID], email: admin[ADMINISTRATOR_EMAIL]})
                .then(existence => {
                    if (existence === 422) {
                        this.setState(prevState => {
                            return {error: {...prevState.error, invalidEmail: true}}
                        });
                        return false
                    } else {
                        this.setState(prevState => {
                            return {error: {...prevState.error, emailExists: existence, invalidEmail: false}}
                        });
                        return !existence
                    }
                })
        }
    }

    validateEmptyFields(admin) {
        let emptyFields = [];
        if (isEmpty(admin[ADMINISTRATOR_EMAIL])) {
            emptyFields.push('E-mail');
        }
        if (isEmpty(admin[PASSWORD])) {
            emptyFields.push('パスワード');
        }

        const hasEmptyFields = !isEmpty(emptyFields);

        this.setState(() => {
            return {emptyFields: hasEmptyFields ? emptyFields.join() : ''}
        });
        this.setState(prevState => {
            return {error: {...prevState.error, hasEmptyFields: hasEmptyFields}}
        });
        return !hasEmptyFields
    }

    alertResult(status) {
        dataChangedAlert(this.isRegisterPage, 'administrator', status);
        if (status === true)
            this.props.history.goBack();
        else
            this.submitBtn.attr('disabled', false);
    }

    handleFocusPassword(e) {
        let pass = e.target.value;
        console.log(pass)
        if (this.state.admin[PASSWORD] == "********") {
            this.setState({admin: {...this.state.admin, [PASSWORD]: ""}})
        }
    }

    handleBlurPassword(e) {
        if (this.state.admin[PASSWORD] == '') {
            this.setState({admin: {...this.state.admin, [PASSWORD]: "********"}})
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        this.submitClicked = true;
        let admin = this.state.admin;
        // Re-validations before register or update
        if (this.validateEmptyFields(admin) &&
            this.hasFormChanged &&
            this.validatePassword(admin[PASSWORD]) &&
            this.validateEmail(admin[ADMINISTRATOR_EMAIL])) {

            this.validateExistingEmail(admin).then(status => {
                if (status) {
                    // if everything is ok:
                    // step 1: transform values
                    admin[ADMINISTRATOR_EMAIL] = toHalfWidth(admin[ADMINISTRATOR_EMAIL]).toLowerCase();
                    // step 2: register or update based on current page
                    if (this.isRegisterPage)
                        registerAdmin(admin).then(status => {
                            // alert a result regardless of success of failure
                            this.alertResult(status)
                        });
                    else {
                        // if the password has not changed, use the original one from selectedRecord obj
                        let password = this.passwordChanged ? admin[PASSWORD] : this.props.location.state.selectedRecord[PASSWORD]
                        updateAdmin({...admin, [PASSWORD]: password}).then((status) => {
                            this.alertResult(status)
                        })
                    }
                } else {
                    this.submitBtn.attr('disabled', false);
                }
            })
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
                <form className="form-control" onSubmit={this.handleSubmit}>
                    <p className="error">
                        <span hidden={!this.state.error.hasEmptyFields}>{this.state.emptyFields}{this.msg.e0002}</span>
                        <span hidden={!this.state.error.invalidEmailChars}>E-mail {this.msg.e0007}</span>
                        <span hidden={!this.state.error.emailExists}>{this.msg.e0010}</span>
                        <span hidden={!this.state.error.invalidPassword}>パスワードは8文字以上でなければなりません。 </span>
                        <span hidden={!this.state.error.invalidEmail}>正しいメールアドレスを入力してください。</span>
                    </p>
                    <dl className="admin-form" onChange={() => this.hasFormChanged = true}>
                        <dt>管理者ID</dt>
                        <dd>{this.state.admin[ADMINISTRATOR_ID]}</dd>
                        <dt><label htmlFor="admin6-email">E-mailアドレス</label></dt>
                        <dd><input type="email"
                                   id="admin6-email"
                                   maxLength={100}
                                   value={this.state.admin[ADMINISTRATOR_EMAIL]}
                                   onChange={e => this.handleEmailInput(e.target.value)}/></dd>
                        <dt><label htmlFor="admin6-password">パスワード</label></dt>
                        <dd><input type="password"
                                   id="admin6-password"
                                   maxLength={100}
                                   value={this.state.admin[PASSWORD]}
                                   onChange={e => this.handlePasswordInput(e.target.value)}


                                   autoComplete="new-password"/></dd>
                        <input type="submit"
                               className={this.isRegisterPage ? 'btn-submit' : 'btn-edit'}
                               value={this.isRegisterPage ? '新規登録' : '変更'}/>
                    </dl>
                </form>
            </main>
        )
    }
}

export default ReactTimeout(C6)