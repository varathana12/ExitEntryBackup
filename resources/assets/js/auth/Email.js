import React from 'react'
import {ADMINISTRATOR_EMAIL} from "../constants/table_column_names";
import axios from 'axios'
import {getMessages,isResetEmail} from "../services/ajax_services";
export default class Email extends React.Component{

    constructor(props){
        super(props)
        this.msg=''
        this.state = {
            list:[],
            message:'',
            [ADMINISTRATOR_EMAIL]:'',
            isError:false,
            isLoading:false,

        }

        this.handleEmail = this.handleEmail.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount(){
        getMessages()
        let msg = JSON.parse(sessionStorage.getItem("messages"))
        this.msg = msg.e0001;

    }
    handleEmail(e){
        let email = e.target.value;
        this.setState({[ADMINISTRATOR_EMAIL]:email});

    }
    handleSubmit(e){
        e.preventDefault();

        isResetEmail(this.state[ADMINISTRATOR_EMAIL]).then(data=>{

            if(data.status){
                this.setState({isError:false,message:'',isLoading:true})
                axios.post('/password/email', {
                    [ADMINISTRATOR_EMAIL]: this.state[ADMINISTRATOR_EMAIL],
                    _token:window.publicToken
                })
                    .then((status) => {
                            console.log(status)
                            if(status.request.status===200){
                                this.setState({isLoading:false})
                                this.props.history.push('success')
                            }
                            else{
                                this.setState({isError:true})
                            }})
                    .catch(error => {
                            this.setState({isError:true})});
            }else{
                this.setState({isError:true,message:this.msg})
            }
        })



    }

    render(){
        return(
            <div>
                <header>
                    <h1 className="logo"><img src="/../../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main>
                    <form method="POST" onSubmit={this.handleSubmit} className="form-control admin-login">
                        <p className="error" hidden={!this.state.isError}>{this.state.message}</p>
                        <p className="u-mgt30">ご登録のメールアドレスに、「パスワード再設定用のURL」をお送りします。</p>
                        <p><input onChange={this.handleEmail}
                                  placeholder="メールアドレスを入力してください。"
                                  maxLength={100}
                                  value={this.state[ADMINISTRATOR_EMAIL]}
                                  type="email"/></p>
                        <div className="loader" hidden={!this.state.isLoading}/>
                        <input type="submit" disabled={this.state.isLoading} className="btn-s-main" value="発行する"/>
                    </form>
                </main>
            </div>
        )

    }


}