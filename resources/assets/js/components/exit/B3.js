import React from 'react'
import axios from 'axios'
import ReactTimeout from 'react-timeout'
import {tryAuth} from "../../services/ajax_services";

import {isUnique, isEmpty, isOverHundred} from '../validation/validations'
import {ID_NAME, MEMBER_ID, EXIT_CONFIRMER_ID} from "../../constants/table_column_names";
import BaseExit from "./BaseExit";

class B3 extends BaseExit {
    constructor(props) {
        super(props)
        this.state = {
            [ID_NAME]: '',
            confirm: [],
            disabled: false,
            time: '',
            [MEMBER_ID]: '',
            [EXIT_CONFIRMER_ID]: '',
            status: false,
            confirmerSelected: true,
            duplicateConfirmer: false,
            btnClicked: false,
            style:{position:"unset",marginLeft:"unset",marginTop:40}
        }

        this.handleInput = this.handleInput.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.returnBack = this.returnBack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleTimeout = this.handleTimeout.bind(this)

    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem(MEMBER_ID)) || isEmpty(sessionStorage.getItem('exit_time')))
            this.props.history.push(`index${window.token}`)

    }

    componentDidMount() {

        axios.get('/exit/confirmer')
            .then(response => {
                this.setState({confirm: response.data})
            })
            .catch(error => {
                if (error.response.status === 401)
                    this.props.history.push('unauthorized')
            });
        this.setState({time: sessionStorage.getItem('exit_time'), [MEMBER_ID]: sessionStorage.getItem(MEMBER_ID)});
        this.props.setTimeout(this.handleTimeout, 300000)

    }

    handleInput(e) {
        let idName = e.target.value;
        this.setState({[ID_NAME]: idName}, () => {
            if (this.state.btnClicked)
                this.validateIfConfirmerSelected()
        })
        let status = (this.validateUniqueness(this.state.confirm, idName) && !isEmpty(idName))
        this.setState({status: status})
    }

    validateUniqueness(confirmers, idName) {
        let unique = isUnique(confirmers, idName)
        this.setState({duplicateConfirmer: !unique})
        return unique
    }

    validateIfConfirmerSelected() {
        let selected = (!isEmpty(this.state[EXIT_CONFIRMER_ID]) || !isEmpty(this.state[ID_NAME]))
        this.setState({confirmerSelected: selected})
        // console.log(selected)
        return selected
    }

    handleSelect(e) {
        let id = e.target.value
        this.setState({
            [EXIT_CONFIRMER_ID]: id,
            // [ID_NAME]: '',
            duplicateConfirmer: false,
            disabled: id ? true : false,
            // style: {}
        }, () => {
            if (this.state.btnClicked)
                this.validateIfConfirmerSelected()
        })
        if (isEmpty(id))
            this.validateUniqueness(this.state.confirm, this.state[ID_NAME])
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({btnClicked: true})
        if (this.validateUniqueness(this.state.confirm, this.state[ID_NAME]) && this.validateIfConfirmerSelected()) {

            if (this.state.disabled) {
                if (this.state[MEMBER_ID] && this.state.time && this.state[EXIT_CONFIRMER_ID]) {
                    axios.post('/exit/confirmed', {
                        [MEMBER_ID]: this.state[MEMBER_ID],
                        time: this.state.time,
                        [EXIT_CONFIRMER_ID]: this.state[EXIT_CONFIRMER_ID]
                    })
                        .then(response => {
                            sessionStorage.setItem('status', this.state.disabled);
                            this.props.history.push(`b4${window.token}`)
                        })
                        .catch(error => {
                            if (error.response.status === 401)
                                this.props.history.push('unauthorized')
                        });
                }
            }
            else {
                if (this.state.status) {
                    if (this.state[MEMBER_ID] && this.state.time) {
                        axios.post('/exit/register_confirmer', {
                            [MEMBER_ID]: this.state[MEMBER_ID],
                            time: this.state.time,
                            [ID_NAME]: this.state[ID_NAME]
                        })
                            .then(response => {
                                console.log(response.data);
                                sessionStorage.setItem('status', this.state.disabled);
                                this.props.history.push(`b4${window.token}`)
                            })
                            .catch(error => {
                                console.log(error)
                                if (error.response.status === 401)
                                    this.props.history.push('unauthorized')
                            });
                    }
                }
            }
        }
    }

    returnBack() {
        this.props.history.goBack();
    }


    handleTimeout() {
        this.props.history.push(`index${window.token}`)
    }

    render() {
        const option = this.state.confirm.map(param => {
            return (
                <option key={param[EXIT_CONFIRMER_ID]} value={param[EXIT_CONFIRMER_ID]}>{param[ID_NAME]}</option>
            )
        })
        return (

            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="exit-p">退館確認者を選択してください。<br/>
                        初めての報告の場合は氏名を<br/>
                        入力してください。</p>
                    <form className="form-control" onSubmit={this.handleSubmit}>
                        <p><select onChange={this.handleSelect}>
                            <option value="">選択してください</option>
                            {option}
                        </select></p>
                        <p><input type="text"
                                  hidden={this.state.disabled}
                                  list="exitlist"
                                  value={this.state[ID_NAME]}
                                  onChange={this.handleInput}
                                  placeholder="初めての方は入力してください" autoComplete="on"
                                  maxLength={100}/></p>
                        <p className="error" hidden={this.state.confirmerSelected}>退館確認者を選択してまたは入力してください。</p>
                        <p className="error" hidden={!this.state.duplicateConfirmer}>こちらの確認者は既に登録されています。</p>
                        <div className="btn-group-sp" style={this.state.style}>
                            <input type="submit" className="btn-s-main" value={"決定"}/>
                            <button form="" className="btn-s-sub" onClick={this.returnBack}>戻る</button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(B3)