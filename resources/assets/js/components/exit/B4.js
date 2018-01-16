import React from 'react'
import ReactTimeout from 'react-timeout'
import {tryAuth} from "../../services/ajax_services";

import {isEmpty} from "../validation/validations";
import BaseExit from "./BaseExit";

class B4 extends BaseExit {

    constructor(props){
        super(props)
        this.state ={
            message:'',
            company_id:this.props.match.params.companyId
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        if (isEmpty(sessionStorage.getItem('member_id')) ||
            isEmpty(sessionStorage.getItem('exit_time')) ||
            isEmpty(sessionStorage.getItem('status')))
            this.props.history.push(`index${window.token}`)
    }

    componentDidMount(){
        //console.log(this.state.company_id)

        let status = sessionStorage.getItem('status');

        if(status=='true'){
            axios.post('/exit/specific_message', {
                    companyId:this.state.company_id,
                    message_id:"n0002",
            })
                .then(response => {
                    console.log(response.data)
                    this.setState({message:response.data.message});
                    this.props.history.push(`b4${window.token}`)
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status === 401)
                        this.props.history.push('unauthorized')
                });
        }
        else if(status=='false'){
            axios.post('/exit/specific_message', {
                    companyId:this.state.company_id,
                    message_id:"n0001",

            })
                .then(response => {
                    console.log(response.data)
                    this.setState({message:response.data.message});
                    this.props.history.push(`b4${window.token}`)
                })
                .catch(error => {
                    console.log(error)
                    if (error.response.status === 401)
                        this.props.history.push('unauthorized')
                });

        }
        this.props.setTimeout(this.handleTimeout, 60000)
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.history.push(`index${window.token}`)
    }

    handleTimeout() {
        this.props.history.push(`index${window.token}`)
    }

    render(){
        return(

            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <p className="exit-p">{this.state.message}</p>
                    <form className="form-control btn-group-sp" onSubmit={this.handleSubmit}>
                        <input type="submit" className="btn-s-main" value="OK"/>
                    </form>
                </main>
            </div>

        )
    }
}

export default ReactTimeout(B4)