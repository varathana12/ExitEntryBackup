import React, {Component} from 'react';
import ReactTimeout from 'react-timeout'
import {isEmpty} from "../validation/validations";
import {NUMBER_OF_VISITOR} from "../../constants/table_column_names";
import BaseEntry from "./BaseEntry";

class A6 extends BaseEntry {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.forWard = this.forWard.bind(this);
        this.handleTimeout = this.handleTimeout.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this.state = {
            style: {
                display: 'block'
            }
        }
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('visitor')))
            this.props.history.push(`index${window.token}`);
    }

    componentDidMount() {
        this.props.setTimeout(this.handleTimeout, 300000);
    }

    handleTimeout() {
        this.props.history.push(`index${window.token}`);
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    generateDate() {
        let data = [];
        for (let i = 6; i <= 100; i++) {
            data.push({key: i, name: i + '名'});
        }
        return data;
    }

    handleClick(e) {
        e.preventDefault()
        console.log(e.target.value);
        let mount = e.target.value;
        mount = mount.substring(0, mount.length - 1);
        mount = parseInt(mount);
        this.forWard(mount);
    }

    forWard(mount) {
        sessionStorage.setItem(NUMBER_OF_VISITOR, mount);
        this.props.history.push(`a7${window.token}`);

        console.log(sessionStorage.getItem(NUMBER_OF_VISITOR))
    }

    handleReturn(e) {
        e.preventDefault();
        this.props.history.goBack();
    }

    onFocus() {
        this.setState({style: {display: 'none'}})
    }

    onBlur() {
        this.setState({style: {display: 'block'}})
    }


    render() {

        const option = this.generateDate().map(item =>
            <option key={item.key} data={item.key}>{item.name}</option>
        );

        const input = [1, 2, 3, 4, 5].map(item =>
            <input type="submit" key={item} value={item + '名'} onClick={this.handleClick}/>
        );

        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="enter-p">同時に入館される方の人数を入力してください。</p>
                    <form className="form-control enter6" onSubmit={this.handleSubmit}>
                        <div className="enter-inner">
                            <p className="u-mgb0 u-small">代表者含め</p>
                            <p className="enter-label">
                                {input}
                            </p>
                            <p>
                                <select onChange={this.handleClick} onFocus={this.onFocus} onBlur={this.onBlur}>
                                    <option style={this.state.style}>6名</option>
                                    {option}
                                </select>
                            </p>
                        </div>
                        <div className="enter-btn">
                            <button className="btn-s-sub u-center" onClick={this.handleReturn}>戻る
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default ReactTimeout(A6)