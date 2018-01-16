import React, {Component} from 'react';
import ReactTimeout from 'react-timeout'
import {isEmpty} from "../validation/validations";
import {COMPANY_NAME, EMAIL_ADDRESS, NAME, PHONE_NUMBER} from "../../constants/table_column_names";
import BaseEntry from "./BaseEntry";

class A3 extends BaseEntry {
    constructor(props) {
        super(props);

        this.state = {
            [COMPANY_NAME]: '',
            [NAME]: '',
            [EMAIL_ADDRESS]: '',
            [PHONE_NUMBER]: ''
        };

        this.handleReturn = this.handleReturn.bind(this);
        this.handleCorrectInfo = this.handleCorrectInfo.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleTimeOut = this.handleTimeOut.bind(this);
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('visitor')))
            this.props.history.push(`index${window.token}`);
    }

    componentDidMount() {
        let visitor = sessionStorage.getItem('visitor');
        if (visitor) {
            visitor = JSON.parse(visitor);
            this.setState({
                [COMPANY_NAME]: visitor[COMPANY_NAME],
                [NAME]: visitor[NAME],
                [EMAIL_ADDRESS]: visitor[EMAIL_ADDRESS],
                [PHONE_NUMBER]: visitor[PHONE_NUMBER]
            })
        }
        this.props.setTimeout(this.handleTimeOut, 300000);
    }

    handleReturn(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    handleCorrectInfo(e) {
        e.preventDefault();
        this.props.history.push(`a4${window.token}`, this.state);
    }

    handleNext(e) {
        e.preventDefault();
        this.props.history.push(`a6${window.token}`, this.state);
    }

    handleTimeOut() {
        this.props.history.push(`index${window.token}`);
    }

    render() {

        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="enter-p">下記の方で間違いありませんか？</p>
                    <form className="form-control">
                        <div className="box-gray">
                            {this.state[COMPANY_NAME]}<br/>
                            {this.state[NAME]} 様<br/>
                            {this.state[EMAIL_ADDRESS]}<br/>
                            {this.state[PHONE_NUMBER]}
                        </div>
                        <div className="btn-group enter-btn">
                            <button form="" className="btn-s-sub" onClick={this.handleReturn}>戻る</button>
                            <input type="submit" className="btn-s-main" value="次へ" onClick={this.handleNext}/>
                            <button form="" className="btn-main" onClick={this.handleCorrectInfo}>登録情報の修正</button>
                        </div>
                    </form>
                </main>
            </div>

        )
    }
}

export default ReactTimeout(A3)