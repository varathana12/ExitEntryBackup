import React from 'react'


export default class Email extends React.Component{

    constructor(){
       super()
    }

    render(){
        return(
            <div>
                <header>
                    <h1 className="logo"><img src="/../../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main style={{textAlign:"center"}}>
                        <p className="u-mgt30">成功したパスワードのリセット、メールの確認</p>
                </main>
            </div>
        )

    }


}