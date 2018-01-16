import React from 'react'
import {getMessages} from "../services/ajax_services";
import {ADMINISTRATOR_EMAIL, PASSWORD} from "../constants/table_column_names";
import {isEmpty} from "../components/validation/validations";
import BaseAdminComponent from "../components/admin/BaseAdminComponent";

export default class Login extends BaseAdminComponent {

    constructor() {

        super();
        this.state = {
            [ADMINISTRATOR_EMAIL]: '',
            [PASSWORD]: '',
            isError: false,
            hasEmptyFields: false
        };
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {

    }

    handleEmail(e) {
        let email = e.target.value;
        this.setState({[ADMINISTRATOR_EMAIL]: email})
    }

    handlePassword(e) {
        let password = e.target.value;
        this.setState({[PASSWORD]: password})
    }

    validateBlankFields() {
        let hasEmptyFields = (isEmpty(this.state[ADMINISTRATOR_EMAIL]) || isEmpty(this.state[PASSWORD]));
        this.setState({hasEmptyFields: hasEmptyFields});
        return !hasEmptyFields;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({hasEmptyFields: false, isError: false});
        if (this.validateBlankFields()) {
            axios.post('/login', {
                [ADMINISTRATOR_EMAIL]: this.state[ADMINISTRATOR_EMAIL],
                [PASSWORD]: this.state[PASSWORD],
                _token: window.publicToken
            })
                .then((status) => {
                        window.location.href = '/admin/index'
                    }
                )
                .catch(error => {
                        this.setState({isError: true})

                    }
                );
        }
    }

    handleTransition(e) {
        window.location.href = '/reset/email'
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <form method="POST" onSubmit={this.handleSubmit} className="form-control admin-login">

                        <p className="error">
                            <span hidden={!this.state.isError}>メールアドレスかパスワードが誤っています。</span>
                            <span hidden={!this.state.hasEmptyFields}>電子メールまたはパスワードは空白にすることはできません。</span>
                        </p>

                        <p className="u-mgt30">
                            <input placeholder="メールアドレスを入力してください。"
                                   onChange={this.handleEmail}
                                   value={this.state[ADMINISTRATOR_EMAIL]}
                                   type="email"
                                   name="email"
                                   maxLength={100}/></p>
                        <p><input placeholder="パスワードを入力してください。"
                                  onChange={this.handlePassword}
                                  value={this.state[PASSWORD]}
                                  type="password"
                                  name="password"
                                  maxLength={100}/></p>
                        <input type="submit" className="btn-s-main" value="ログイン"/>
                        <p><a href="#" onClick={this.handleTransition}>パスワードを忘れた方はこちら</a></p>
                    </form>
                </main>
            </div>
        )

    }


}