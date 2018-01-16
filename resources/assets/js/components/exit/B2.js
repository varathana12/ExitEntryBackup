import React from 'react'
import moment from 'moment'
import ReactTimeout from 'react-timeout'
import {tryAuth} from "../../services/ajax_services";

import {isEmpty} from "../validation/validations";
import {MEMBER_ID} from "../../constants/table_column_names";
import BaseExit from "./BaseExit";

class B2 extends BaseExit {

    constructor(props) {
        super(props)

        this.state = {
            time: ''
        }

        this.returnBack = this.returnBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this)
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem(MEMBER_ID)))
            this.props.history.push(`index${window.token}`)
    }

    componentDidMount() {
        let now = new moment();
        this.setState({time: now.format("HH:mm")});
        this.props.setTimeout(this.handleTimeout, 60000)
    }

    handleChange(e) {
        let time = e.target.value
        this.setState({time: time})
        console.log(time)
    }

    handleSubmit(e) {
        e.preventDefault();
        if(this.state.time){
            let d = new Date();
            sessionStorage.setItem('exit_time',this.state.time+":"+d.getSeconds())
            this.props.history.push(`b3${window.token}`)
        }

    }

    returnBack() {
        this.props.history.goBack();
    }

    handleTimeout() {
        this.props.history.push(`index${window.token}`)
    }

    render() {
        return (

            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="exit-p">退館時刻を入力してください。</p>
                    <form className="form-control" onSubmit={this.handleSubmit}>
                        <p><input type="time" placeholder="-- : --" id="" onChange={this.handleChange}
                                  value={this.state.time}/></p>
                        <div className="btn-group-sp">
                            <input type="submit" className="btn-s-main" value="決定"/>
                            <button form="" className="btn-s-sub" onClick={this.returnBack}>戻る</button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(B2)