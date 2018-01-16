import React from 'react'
import {
    isValidEmail, isValidTelChars, isValidEmailChars, isEmpty, isExistingEmail,
    isValidTel
} from "../validation/validations";

import ReactTimeout from 'react-timeout'
import {formatPhoneNumber, toHalfWidth} from "../../utils/transformers";
import {COMPANY_NAME, EMAIL_ADDRESS, MEMBER_ID, NAME, PHONE_NUMBER} from "../../constants/table_column_names";
import BaseEntry from "./BaseEntry";

class A4 extends BaseEntry {
    constructor(props) {
        super(props);

        this.messages = {
            e0002: '',
            e0007: '',
            e0008: '',
            e0010: ''
        };

        this.submitClicked = false;

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
        this.handleReturn = this.handleReturn.bind(this);
        this.handleCompanyInput = this.handleCompanyInput.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleTelInput = this.handleTelInput.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateExistingEmail = this.validateExistingEmail.bind(this);
        this.validateTel = this.validateTel.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
    }

    componentDidMount() {
        let visitor = sessionStorage.getItem('visitor');
        if (!isEmpty(visitor)) {
            visitor = JSON.parse(visitor);
            this.setState({visitor: visitor});
        }
        let messages = JSON.parse(sessionStorage.getItem('messages'));
        if (!isEmpty(messages)) {
            this.messages.e0002 = messages.e0002;
            this.messages.e0007 = messages.e0007;
            this.messages.e0008 = messages.e0008;
            this.messages.e0010 = messages.e0010;
        } else
            this.props.history.push(`index${window.token}`);
        this.props.setTimeout(this.handleTimeout, 300000);
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
                error: {
                    ...prevState.error,
                    invalidEmailChars: false,
                    invalidEmail: false,
                    emailExists: false
                }
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
                error: {
                    ...prevState.error,
                    invalidTelChars: false,
                    invalidTel: false
                }
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
                    if (existence === 401)
                        this.props.history.push('unauthorized');
                    else if (existence === 422) {
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

    handleSubmit(e) {
        e.preventDefault();
        this.submitClicked = true;
        let visitor = this.state.visitor;
        // Re-validations before pushing to A5 page
        if (this.validateEmptyFields(visitor))
            if (this.validateTel(visitor[PHONE_NUMBER]))
                if (this.validateEmail(visitor[EMAIL_ADDRESS])) {
                    this.validateExistingEmail(visitor).then(status => {
                        if (status) {
                            sessionStorage.setItem("visitor", JSON.stringify(visitor));
                            this.props.history.push(`a5${window.token}`);
                        }
                    })
                }
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
                    <p className="enter-p">情報を入力してください。</p>
                    <form className="form-control" onSubmit={this.handleSubmit}>
                        <div className="enter-inner">
                            <p><input placeholder="会社名"
                                      type="text"
                                      maxLength={100}
                                      value={this.state.visitor[COMPANY_NAME]}
                                      onChange={(e) => this.handleCompanyInput(e.target.value)}/>
                            </p>
                            <p><input placeholder="氏名"
                                      type="text"
                                      maxLength={100}
                                      value={this.state.visitor[NAME]}
                                      onChange={(e) => this.handleNameInput(e.target.value)}/>
                            </p>
                            <p><input placeholder="E-mail"
                                      type="email"
                                      maxLength={100}
                                      value={this.state.visitor[EMAIL_ADDRESS]}
                                      onChange={(e) => this.handleEmailInput(e.target.value)}/>
                            </p>
                            <p><input placeholder="TEL"
                                      type="tel"
                                      maxLength={100}
                                      value={this.state.visitor[PHONE_NUMBER]}
                                      onChange={(e) => this.handleTelInput(e.target.value)}/>
                            </p>
                            <p className="error" hidden={!this.state.error.hasEmptyFields}>
                                {this.state.emptyFields} {this.messages.e0002}</p>
                            <p className="error" hidden={!this.state.error.invalidEmailChars}>
                                E-mail {this.messages.e0007}</p>
                            <p className="error" hidden={!this.state.error.invalidTelChars}>
                                TEL {this.messages.e0008}</p>
                            <p className="error" hidden={!this.state.error.emailExists}>
                                {this.messages.e0010}</p>
                            <p className="error" hidden={!this.state.error.invalidTel}>有効な電話番号を入力して下さい。</p>
                            <p className="error" hidden={!this.state.error.invalidEmail}>有効なメールアドレスを入力してください。</p>
                        </div>
                        <div className="btn-group enter-btn">
                            <button type="button" className="btn-s-sub" onClick={this.handleReturn}>戻る</button>
                            <input type="submit" className="btn-s-main" value="次へ"/>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(A4)