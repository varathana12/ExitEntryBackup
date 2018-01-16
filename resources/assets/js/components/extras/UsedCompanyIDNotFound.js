import React, {Component} from 'react'

export default class UsedCompanyIDNotFound extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main className="error-page">
                    <h2>Company ID Not Found!</h2>
                    <p>Sorry, the Company ID you have entered does not exist.</p>
                </main>
            </div>
        )
    }
}