import React, {Component} from 'react';
import {getMessages, getReceptionPhoneNumber} from "../../services/ajax_services";
import BaseComponent from '../BaseComponent'
import BaseEntry from "./BaseEntry";
import {RECEPTION_PHONE_NUMBER} from "../../constants/table_column_names";

class A1 extends BaseEntry {
    constructor(props) {
        super(props);

        this.state = {
            [RECEPTION_PHONE_NUMBER]: '',
        };
        this.toRegistered = this.toRegistered.bind(this);
        this.toUnregistered = this.toUnregistered.bind(this);
    }

    componentDidMount() {
        sessionStorage.clear();
        getReceptionPhoneNumber()
            .then(receptionPhone => {
                if (receptionPhone === 401)
                    this.props.history.push('unauthorized')
                this.setState({[RECEPTION_PHONE_NUMBER]: `tel:${receptionPhone}`}, () => {
                    sessionStorage.setItem([RECEPTION_PHONE_NUMBER], this.state[RECEPTION_PHONE_NUMBER]);
                });
            })
        getMessages().then(status => {
            if (status === 401)
                this.props.history.push('unauthorized')
        });
    }

    toRegistered() {
        this.props.history.push(`a2${window.token}`);
    }

    toUnregistered() {
        this.props.history.push(`a4${window.token}`);
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo-top"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p>
                        ご来訪ありがとうございます。<br/>
                        入館手続きをさせていただきます。
                    </p>
                    <p>メールアドレスの登録はお済みでしょうか？</p>
                    <div className="btn-group enter-btn">
                        <button className="btn-s-main" onClick={this.toRegistered}>登録済み</button>
                        <button className="btn-s-main" onClick={this.toUnregistered}>未登録</button>
                        <a href={this.state[RECEPTION_PHONE_NUMBER]} className="btn-sub tel-btn">
                            お約束が無い方はこちら（受付へ繋ぎます）
                        </a>
                    </div>
                </main>
            </div>
        )
    }
}

export default A1