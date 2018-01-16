import React, {Component} from 'react'

export default class Unauthorized extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <header>
                    <h1 className="logo"><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
                </header>
                <main className="error-page">
                    <h2>Unauthorized!</h2>
                    <p>Sorry, you don't have permission to access the system.</p>
                </main>
            </div>
        )
    }
}