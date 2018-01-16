import React, {Component} from 'react'
import ReactTimeout from 'react-timeout'
import {isEmpty, isValidEmail} from "../validation/validations";
import {formatPhoneNumber, toHalfWidth} from "../../utils/transformers";
import {asYouType} from "../validation/custom_libphonenumber-js";
import {
    COMPANY_NAME,
    EMAIL_ADDRESS,
    MEMBER_ID,
    PHONE_NUMBER,
    MESSAGE_ID,
    MESSAGE
} from "../../constants/table_column_names";
import {getAllEmails, getVisitor} from "../../services/ajax_services";
import BaseEntry from "./BaseEntry";

class A2 extends BaseEntry {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            visitor: {},
            email: sessionStorage.getItem("email") !== null ? sessionStorage.getItem("email") : '',
            message: '',
            list: [],
            option: [],
            styles: {display: 'none'}
        };

        this.handleReturn = this.handleReturn.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.clickList = this.clickList.bind(this);
        this.hideErrorMsg = this.hideErrorMsg.bind(this);
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('messages')))
            this.props.history.push(`index${window.token}`);
    }

    handleEmailInput(e) {
        let email = e.target.value;

        this.setState({email: email});

        email = toHalfWidth(email);

        if (email) {
            let newList = this.state.list.filter(function (v) {
                return v[EMAIL_ADDRESS].indexOf(email) !== -1;
            });

            this.setState({option: newList});
            if (newList.length > 0) {
                this.setState({styles: {display: 'block'}});
                this.setState({error: false})
            }
            else {
                this.setState({styles: {display: 'none'}});
                this.setState({error: true})
            }
        }
        else {
            this.setState({option: []});
            this.setState({styles: {display: 'none'}});
            this.setState({error: true})
        }
    }

    componentDidMount() {
        $(document).click(() => {
            if (this.state.styles.display !== 'none')
                this.setState({styles: {display: 'none'}})
        });
        getAllEmails().then(emails => {
            if (emails === 401)
                this.props.history.push('unauthorized')
            console.log(emails)
            this.setState({list: emails})
        })
        this.props.setTimeout(this.handleTimeout, 300000);
    }

    handleReturn(e) {
        e.preventDefault();
        this.props.history.goBack();

    }

    handleSubmit(e) {
        e.preventDefault();
        let email = this.state.email
        if (isValidEmail(email))
            getVisitor(email)
                .then(data => {
                    if (data === 401)
                        this.props.history.push('unauthorized')

                    this.setState({visitor: data});
                    console.log(data);

                    if (data[MEMBER_ID]) {
                        this.setState({error: false});
                        this.handleStore(data);
                    }
                    else if (data[MESSAGE_ID]) {
                        let messageId = data[MESSAGE_ID];
                        this.setState({message: JSON.parse(sessionStorage.getItem('messages'))[messageId]});
                        this.setState({error: true});
                    }
                })
    }

    handleTimeout() {
        this.props.history.push(`index${window.token}`);
    }

    handleStore(visitor) {
        visitor[PHONE_NUMBER] = formatPhoneNumber(visitor[PHONE_NUMBER])
        sessionStorage.setItem('visitor', JSON.stringify(visitor));
        sessionStorage.setItem('email', this.state.email);
        this.props.history.push(`a3${window.token}`);
    }

    clickList(e) {
        this.setState({email: e.currentTarget.dataset.id});
        this.setState({error: true});
        this.setState({styles: {display: 'none'}})
    }

    hideErrorMsg() {
        this.setState({message: ''});
        this.setState({error: false});
    }

    render() {
        const list = this.state.option.map((v) => {
            return <li onClick={this.clickList} data-id={v[EMAIL_ADDRESS]}
                       key={v[EMAIL_ADDRESS]}>{v[EMAIL_ADDRESS]}</li>;
        });
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="enter-p">ご登録されている<br/>
                        メールアドレスまたはIDを入力してください。
                    </p>
                    <form className="form-control" onSubmit={this.handleSubmit}>
                        <p>
                            <input placeholder="メールアドレスまたはID"
                                   value={this.state.email}
                                   type="text" id="identify"
                                   onFocus={this.hideErrorMsg}
                                   onChange={this.handleEmailInput}/>
                        </p>
                        <ul className="search" style={this.state.styles}>
                            {list}
                        </ul>
                        <p className="error" hidden={!this.state.error}>
                            {this.state.message}
                        </p>
                        <div className="btn-group enter-btn">
                            <button form="" className="btn-s-sub" onClick={this.handleReturn}>戻る</button>
                            <input type="submit" className="btn-s-main" value="次へ"/>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(A2)