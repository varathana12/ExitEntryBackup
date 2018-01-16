import React from 'react'

const NavBar = (props) => {
    return (
        <nav className="admin-nav">
            <h1><img src="/../images/logo.png" alt="ウェブインパクト"/></h1>
            <ul>
                <li><a className="btn-nav"
                       onClick={() => props.history.push('index', {
                           selectedNav: {
                               navName: 'c3',
                               navTitle: 'visitor'
                           }
                       })}>来訪者情報</a>
                </li>
                <li><a className="btn-nav"
                       onClick={() => props.history.push('index', {
                           selectedNav: {
                               navName: 'c4',
                               navTitle: 'entry-exit-info'
                           }
                       })}>入退館情報</a></li>
                <li><a className="btn-nav"
                       onClick={() => props.history.push('index', {
                           selectedNav: {
                               navName: 'c5',
                               navTitle: 'exit-confirmer'
                           }
                       })}>退館確認者情報</a></li>
                <li><a className="btn-nav"
                       onClick={() => props.history.push('index', {
                           selectedNav:
                               {
                                   navName: 'c6',
                                   navTitle: 'admin'
                               }
                       })}>管理者情報</a>
                </li>
                <li><a className="btn-nav"
                       onClick={() => props.history.push('index', {
                           selectedNav: {
                               navName: 'c7',
                               navTitle: 'reception-phone'
                           }
                       })}>受付電話番号情報</a></li>
                <li><a className="btn-nav-sub" onClick={() => props.history.push('c8', {
                    selectedNav: {
                        navName: 'c8',
                        navTitle: 'token'
                    }
                })}>トークン情報</a>
                </li>
            </ul>
        </nav>
    )
};

export default NavBar