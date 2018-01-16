import React from 'react'
import ReactTimeout from 'react-timeout'
import {
    isEmpty, isExistingEmail, isValidEmail, isValidEmailChars, isValidTel,
    isValidTelChars
} from "../validation/validations";
import {filterPhoneNumber, formatPhoneNumber, toHalfWidth} from "../../utils/transformers";
import {getLastId, registerVisitor, updateVisitor} from "../../services/ajax_services";
import {
    EMAIL_ADDRESS, MEMBER_ID, PHONE_NUMBER, COMPANY_NAME, NAME,
} from "../../constants/table_column_names";
import {TIME_OUT} from "../../constants/fixed_numbers";
import {dataChangedAlert} from "../extras/data_changed_alert";
import BaseABScreen from "./BaseABScreen";

class C3 extends BaseABScreen {
    constructor(props) {
        super(props);

        this.msg = {
            e0002: '',
            e0007: '',
            e0008: '',
            e0010: ''
        };

        this.state = {
            visitor: {
                [MEMBER_ID]: '',
                [COMPANY_NAME]: '',
                [NAME]: '',
                [EMAIL_ADDRESS]: '',
                [PHONE_NUMBER]: ''
            },
            error: {
                hasEmptyFields: false,
                invalidEmail: false,
                invalidEmailChars: false,
                invalidTel: false,
                invalidTelChars: false,
                emailExists: false
            },
            emptyFields: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handleCompanyInput = this.handleCompanyInput.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleTelInput = this.handleTelInput.bind(this);
        this.validateExistingEmail = this.validateExistingEmail.bind(this);
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
            this.msg.e0008 = msg.e0008;
            this.msg.e0010 = msg.e0010;
        } else
            this.props.history.push('index');
        if (!this.isRegisterPage)
            this.setState({visitor: this.props.location.state.selectedRecord});
        else {
            getLastId('visitor').then(lastId => {
                if (!isEmpty(lastId))
                    this.setState(prevState => {
                        return {visitor: {...prevState.visitor, [MEMBER_ID]: lastId}}
                    });
                else
                    this.props.history.goBack()
            })
        }
        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }

    handleCompanyInput(companyName) {
        this.setState({visitor: {...this.state.visitor, [COMPANY_NAME]: companyName}},
            () => {
                if (this.submitClicked)
                    this.validateEmptyFields(this.state.visitor)
            }
        )
    }

    handleNameInput(name) {
        this.setState({visitor: {...this.state.visitor, [NAME]: name}},
            () => {
                if (this.submitClicked)
                    this.validateEmptyFields(this.state.visitor)
            }
        )
    }

    handleEmailInput(email) {
        this.setState(prevState => {
            return {
                visitor: {...prevState.visitor, [EMAIL_ADDRESS]: email},
                error: {...prevState.error, invalidEmailChars: false, invalidEmail: false, emailExists: false}
            }
        }, () => {
            if (this.submitClicked)
                this.validateEmptyFields(this.state.visitor)
        });
        // Email validation
        if (!isEmpty(email))
            this.validateEmail(email)
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

    handleTelInput(tel) {
        this.setState(prevState => {
            return {
                visitor: {...prevState.visitor, [PHONE_NUMBER]: tel},
                error: {...prevState.error, invalidTelChars: false, invalidTel: false}
            }
        }, () => {
            if (this.submitClicked)
                this.validateEmptyFields(this.state.visitor);
        });
        // TEL validation
        if (!isEmpty(tel))
            this.validateTel(tel)
    }

    validateTel(tel) {
        tel = toHalfWidth(tel);
        let validTelChars = isValidTelChars(tel);
        this.setState(prevState => {
            return {error: {...prevState.error, invalidTelChars: !validTelChars}}
        });
        if (validTelChars) {
            let formattedTel = formatPhoneNumber(tel);
            this.setState(prevState => {
                return {visitor: {...prevState.visitor, [PHONE_NUMBER]: formattedTel}}
            });
            let validTel = isValidTel(formattedTel);
            this.setState(prevState => {
                return {error: {...prevState.error, invalidTel: !validTel}}
            });
            return validTel
        }
        return validTelChars
    }

    validateExistingEmail(visitor) {
        if (!this.state.error.invalidEmail && !isEmpty(visitor[EMAIL_ADDRESS])) {
            return isExistingEmail({model: 'visitor', id: visitor[MEMBER_ID], email: visitor[EMAIL_ADDRESS]})
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

    validateEmptyFields(visitor) {
        let emptyFields = [];
        if (isEmpty(visitor[COMPANY_NAME])) {
            emptyFields.push('会社名');
        }
        if (isEmpty(visitor[NAME])) {
            emptyFields.push('氏名');
        }
        if (isEmpty(visitor[EMAIL_ADDRESS])) {
            emptyFields.push('E-mail');
        }
        if (isEmpty(visitor[PHONE_NUMBER])) {
            emptyFields.push('TEL');
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
        dataChangedAlert(this.isRegisterPage, 'visitor', status);
        if (status === true)
            this.props.history.goBack();
        else
            this.submitBtn.attr('disabled', false);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        this.submitClicked = true;
        let visitor = this.state.visitor;
        // Re-validations before register or update
        if (this.validateEmptyFields(visitor) &&
            this.hasFormChanged &&
            this.validateTel(visitor[PHONE_NUMBER]) &&
            this.validateEmail(visitor[EMAIL_ADDRESS])) {

            this.validateExistingEmail(visitor).then(status => {
                if (status) {
                    // if everything is ok:
                    // step 1: transform values
                    visitor[COMPANY_NAME] = toHalfWidth(visitor[COMPANY_NAME]);
                    visitor[NAME] = toHalfWidth(visitor[NAME]);
                    visitor[EMAIL_ADDRESS] = toHalfWidth(visitor[EMAIL_ADDRESS]).toLowerCase();
                    visitor[PHONE_NUMBER] = filterPhoneNumber(toHalfWidth(visitor[PHONE_NUMBER]));
                    // step 2: register or update based on current page
                    if (this.isRegisterPage)
                        registerVisitor(visitor).then(status => {
                            // alert a result regardless of success of failure
                            this.alertResult(status)
                        });
                    else
                        updateVisitor(visitor).then((status) => {
                            this.alertResult(status)
                        })
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
                        <span hidden={!this.state.error.invalidTelChars}>TEL {this.msg.e0008}</span>
                        <span hidden={!this.state.error.emailExists}>{this.msg.e0010}</span>
                        <span hidden={!this.state.error.invalidTel}>有効な電話番号を入力して下さい。</span>
                        <span hidden={!this.state.error.invalidEmail}>有効なメールアドレスを入力してください。</span>
                    </p>
                    <dl className="admin-form" onChange={() => this.hasFormChanged = true}>
                        <dt>会員ID</dt>
                        <dd>{this.state.visitor[MEMBER_ID]}</dd>
                        <dt><label htmlFor="admin3-company">会社名</label></dt>
                        <dd><input type="text"
                                   id="admin3-company"
                                   maxLength={100}
                                   value={this.state.visitor[COMPANY_NAME]}
                                   onChange={(e) => this.handleCompanyInput(e.target.value)}/></dd>
                        <dt><label htmlFor="admin3-name">氏名</label></dt>
                        <dd><input type="text"
                                   id="admin3-name"
                                   maxLength={100}
                                   value={this.state.visitor[NAME]}
                                   onChange={(e) => this.handleNameInput(e.target.value)}/></dd>
                        <dt><label htmlFor="admin3-email">E-mailアドレス</label></dt>
                        <dd><input type="email"
                                   id="admin3-email"
                                   maxLength={100}
                                   value={this.state.visitor[EMAIL_ADDRESS]}
                                   onChange={(e) => this.handleEmailInput(e.target.value)}
                        /></dd>
                        <dt><label htmlFor="admin3-tel">電話番号</label></dt>
                        <dd><input type="tel"
                                   id="admin3-tel"
                                   maxLength={100}
                                   value={this.state.visitor[PHONE_NUMBER]}
                                   onChange={(e) => this.handleTelInput(e.target.value)}/></dd>
                        <input type="submit"
                               className={this.isRegisterPage ? 'btn-submit' : 'btn-edit'}
                               value={this.isRegisterPage ? '新規登録' : '変更'}/>
                    </dl>
                </form>
            </main>
        )
    }
}

export default ReactTimeout(C3)