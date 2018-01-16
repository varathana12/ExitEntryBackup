import React from 'react'
import ReactTimeout from 'react-timeout'
import {USED_COMPANY_ID,TOKEN} from "../../constants/table_column_names";
import {TIME_OUT} from "../../constants/fixed_numbers";
import BaseAdminComponent from "./BaseAdminComponent";
import {getCompany} from "../../services/ajax_services";

const Clipboard = require('clipboard');
new Clipboard('.clipboard');

class C8 extends BaseAdminComponent{

    constructor(props){
        super(props);
        this.msg={
            n0003:''
        }
        this.state = {
            [TOKEN]:'',
            url:'',
            [USED_COMPANY_ID]:'',
            message:'',
            disabled:false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.initialValue = this.initialValue.bind(this)

    }

    componentWillMount() {
        let msg = JSON.parse(sessionStorage.getItem('messages'));
        if (!this.props.history.location.state || !msg)
            this.props.history.push('index');
        else
            this.msg.n0003 = msg.n0003;
    }

    componentDidMount(){
        this.setState({url:this.URL()})
        getCompany()
            .then(response => {
                if(response.status){

                    this.initialValue(response.company)
                }
            })
            .catch(error =>
                console.log(error)
            );
        this.submitBtn = $('input[type="submit"]');
        this.props.setTimeout(this.handleTimeout.bind(this), TIME_OUT)
    }
    initialValue(company){
        this.setState({[USED_COMPANY_ID]: company[USED_COMPANY_ID]
            ,[TOKEN]:company[TOKEN]})
    }

    URL(){
        let array = window.location.href.split('/');
        let url = array[2];
        return url;
    }
    handleSubmit(e){
        e.preventDefault();
        this.submitBtn.attr('disabled', true);
        axios.post('/admin/admin/updateToken')
            .then((status) => {
                    if(status.data.status){
                        this.setState({message:this.msg.n0003});
                        this.setState({[TOKEN]:status.data.token});
                    }
                    else{
                        this.setState({message:''})
                    }
                this.setState({disabled:false});
                this.submitBtn.attr('disabled', false);
                }

            )
            .catch(error => {
                this.setState({disabled:false});
                this.submitBtn.attr('disabled', false);
                }
            );
    }

    handleTimeout() {
        this.props.history.push(`index`);
    }

    render(){
        return(
            <main className="admin-main">
                <form onSubmit={this.handleSubmit} className="form-control">
                    <p className="error">{this.state.message}</p>
                    <dl className="admin-form">
                        <dt>現在のURL</dt>
                        <dd id="url-token">{this.state.url}/{this.state[USED_COMPANY_ID]}/exit/index?token={this.state[TOKEN]}</dd>

                        <input type="submit" className="btn-edit" value="トークンを更新する"/>
                        </dl>
                </form>
            </main>
        )
    }
}
export default ReactTimeout(C8)