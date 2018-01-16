import React from 'react'
import axios from 'axios'
// import {getMessages} from "../services/ajax_services";
import {isEmpty, isOverHundred} from "../components/validation/validations";
import {
    PASSWORD, ADMINISTRATOR_EMAIL
} from "../constants/table_column_names";

export default class FormReset extends React.Component {
    constructor() {
        super();

        this.msg = {
            e0002: 'を入力してください。',
            invalidPassword: 'A password should contain at least 8 characters',
            unmatchedPassword: 'Passwords do not match'
        };

        this.submitClicked = false;

        this.state = {
            [PASSWORD]: '',
            confirmPassword: '',
            message: '',
            [ADMINISTRATOR_EMAIL]: '',
            token: '',
            validatePassword: {status: false, message: 'blank'},
            validateConfirmPassword: {state: false, message: ''},
            isError: false,
            invalidPassword: false,
            unmatchedPassword: false,
            hasEmptyFields: false,
            emptyFields: ''
        };

        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        // getMessages();
        // let msg = JSON.parse(sessionStorage.getItem('messages'));
        // this.msg.e0002 = msg.e0002;
        let url = window.location.href;
        let urls = new URL(window.location.href);
        let email = urls.searchParams.get("email");
        let token = url.split('/')[5].split('?')[0];
        console.log(token);
        this.setState({[ADMINISTRATOR_EMAIL]: email, token})
    }

    handleNewPassword(e) {
        this.setState({invalidPassword: false, unmatchedPassword: false});
        let newPassword = e.target.value;
        this.setState({[PASSWORD]: newPassword}, () => {
            if (this.submitClicked) {
                this.validateEmptyFields(newPassword, this.state.confirmPassword)
            }
        });
        if (!isEmpty(newPassword)) {
            this.validateNewPassword(newPassword);
            if (!isEmpty(this.state.confirmPassword))
                this.validateConfirmPassword(newPassword, this.state.confirmPassword)
        }

    }

    handleConfirmPassword(e) {
        this.setState({invalidPassword: false, unmatchedPassword: false});
        let confirmPassword = e.target.value;
        this.setState({confirmPassword: confirmPassword}, () => {
            if (this.submitClicked) {
                this.validateEmptyFields(this.state.password, confirmPassword);
            }
        });
        if (!isEmpty(confirmPassword) && !isEmpty(this.state[PASSWORD])) {
            this.validateNewPassword(this.state[PASSWORD]);
            this.validateConfirmPassword(this.state.password, confirmPassword)
        }
    }

    validateNewPassword(password) {
        let valid = password.length >= 8;
        this.setState({invalidPassword: !valid});
        return valid
    }

    validateConfirmPassword(newPassword, confirmPassword) {
        let match = newPassword === confirmPassword;
        this.setState({unmatchedPassword: !match});
        return match
    }

    validateEmptyFields(newPassword, confirmPassword) {
        let emptyFields = [];
        if (isEmpty(newPassword)) {
            emptyFields.push('Password');
        }
        if (isEmpty(confirmPassword)) {
            emptyFields.push('Confirm Password');
        }

        const hasEmptyFields = !isEmpty(emptyFields);

        this.setState(() => {
            return {emptyFields: hasEmptyFields ? emptyFields.join() : ''}
        });
        this.setState({hasEmptyFields: hasEmptyFields});
        return !hasEmptyFields
    }

    handleSubmit(e) {
        e.preventDefault();
        this.submitClicked = true;
        if (this.validateEmptyFields(this.state.password, this.state.confirmPassword))
            if (this.validateNewPassword(this.state.password))
                if (this.validateConfirmPassword(this.state.password, this.state.confirmPassword)) {
                    axios.post('/password/reset', {

                        [PASSWORD]: this.state[PASSWORD],
                        [ADMINISTRATOR_EMAIL]: this.state[ADMINISTRATOR_EMAIL],
                        password_confirmation: this.state.confirmPassword,
                        _token: window.publicToken,
                        token: this.state.token
                    })
                        .then((status) => {
                                if (this.isMatchURL(status.request.responseURL)) {
                                    this.setState({isError: true})
                                }
                                else {
                                    window.location.href = status.request.responseURL
                                }

                            }
                        )
                        .catch(error => {
                                console.log(error);
                                this.setState({isError: true})

                            }
                        );
                }

    }

    isMatchURL(e) {
        let url = window.location.href;
        return url === e

    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src='../../images/logo.png' alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <form className="form-control admin-login" onSubmit={this.handleSubmit}>
                        <p className="error">
                            <span hidden={!this.state.hasEmptyFields}>{this.state.emptyFields} {this.msg.e0002}</span>
                            <span hidden={!this.state.invalidPassword}>{this.msg.invalidPassword}</span>
                            <span hidden={!this.state.unmatchedPassword}>{this.msg.unmatchedPassword}</span>
                        </p>

                        <dl className="admin-form">
                            <dt><label htmlFor="new-password">New Password</label></dt>
                            <dd><input type="password"
                                       maxLength={100}
                                       onChange={this.handleNewPassword}/></dd>
                            <dt><label htmlFor="confirm-password">Confirm Password</label></dt>
                            <dd><input type="password"
                                       maxLength={100}
                                       onChange={this.handleConfirmPassword}/></dd>
                        </dl>
                        <input type="submit" className="btn-s-main" value="発行する" style={{float: "right"}}/>
                    </form>
                </main>
            </div>

        )
    }
}