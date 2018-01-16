import React from 'react'
import swal from 'sweetalert'
import ReactPaginate from 'react-paginate'

import {isEmpty} from "../validation/validations";

import RecordList from "./list-components/RecordList";
import {
    ADMINISTRATOR_ID, ENTRY_EXIT_INFORMATION_ID, EXIT_CONFIRMER_ID, MEMBER_ID, PHONE_NUMBER,
    RECEPTION_PHONE_ID, RECEPTION_PHONE_NUMBER
} from "../../constants/table_column_names";
import {deleteRecord, getAllRecords} from "../../services/ajax_services";
import {PER_PAGE} from "../../constants/fixed_numbers";
import {formatPhoneNumber} from "../../utils/transformers";
import BaseAdminComponent from "./BaseAdminComponent";

class C2 extends BaseAdminComponent {
    constructor(props) {
        super(props);

        this.mounted = false;
        this.state = {
            selectedRecord: {},
            selectedNav: {
                records: [],
                navName: 'c3',
                navTitle: 'visitor'
            },
            pageCount: 1
        };

        this.handleRegister = this.handleRegister.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.fetchRecords = this.fetchRecords.bind(this)
    }

    componentDidMount() {
        this.mounted = true;
        let _this = this;
        $(document).click(function (e) {
            // console.log(e)
            $('.c2-table-row').removeClass('selected');
            if ($(e.target).is('td')) {
                $(e.target.parentElement).addClass('selected')
            }
            else if ($(e.target).not('button')) {
                if (_this.mounted)
                    _this.setState({selectedRecord: {}})
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            window.activePage = 0;
            this.setState({selectedRecord: {}}, () => this.fetchRecords())
        }
    }

    componentWillUnmount() {
        this.mounted = false
    }

    handleSelectRecord(record) {
        this.setState({selectedRecord: record})
    }

    handleRegister() {
        this.props.history.push(`${this.state.selectedNav.navName}`, {})
    }

    handleUpdate() {
        this.props.history.push(`${this.state.selectedNav.navName}`, {selectedRecord: this.state.selectedRecord})
    }

    handleDelete() {
        let props = this.props.location.state;
        let sr = this.state.selectedRecord;
        let selectedNav = isEmpty(props) ? this.state.selectedNav : props.selectedNav;
        let id = sr[RECEPTION_PHONE_ID] ? sr[RECEPTION_PHONE_ID] :
            sr[ADMINISTRATOR_ID] ? sr[ADMINISTRATOR_ID] :
                sr[ENTRY_EXIT_INFORMATION_ID] ? sr[ENTRY_EXIT_INFORMATION_ID] :
                    sr[EXIT_CONFIRMER_ID] ? sr[EXIT_CONFIRMER_ID] :
                        sr[MEMBER_ID];
        swal({
            title: 'Are you sure?',
            text: 'This record will be deleted!',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
            // closeOnClickOutside: false
        }).then(confirm => {
            if (confirm === true)
                return deleteRecord(selectedNav.navTitle, id).then(status => status);
            else {
                return confirm
            }
        }).then(result => {
            if (result === null)
                swal.close();
            else if (result === true) {
                this.fetchRecords();
                swal('Done', 'The record has been deleted!', 'success')
            } else if (result === false)
                swal('Failed', 'The record has not been deleted!', 'error');
            else
                swal('We are sorry!', 'There were some problems with the deletion!', 'warning')
        })
    }

    fetchRecords() {
        $('.c2-table-row').removeClass('selected');
        this.setState({selectedRecord: {}});
        let pageNumber = window.activePage + 1;
        let props = this.props.location.state;
        let nav = !isEmpty(props) ? props.selectedNav : this.state.selectedNav;
        let navTitle = nav.navTitle;
        getAllRecords(nav.navTitle, pageNumber)
            .then(pagination => {
                // In case of "Visitor" or "Reception phone number" page, format phone numbers
                if (navTitle === 'visitor' || navTitle === 'reception-phone')
                    pagination.data.map(record => {
                        if (navTitle === 'visitor')
                            record[PHONE_NUMBER] = formatPhoneNumber(record[PHONE_NUMBER]);
                        else
                            record[RECEPTION_PHONE_NUMBER] = formatPhoneNumber(record[RECEPTION_PHONE_NUMBER])
                    });
                this.setState({
                    selectedNav: {records: pagination.data, navName: nav.navName, navTitle: nav.navTitle},
                    pageCount: Math.ceil(pagination.total / PER_PAGE)
                });
            })
    }

    handlePageClick(data) {
        window.activePage = data.selected;
        this.fetchRecords()
    }

    render() {
        let props = this.props.location.state;
        let navTitle = this.state.selectedNav.navTitle;
        if (!isEmpty(props)) {
            navTitle = !isEmpty(props.selectedNav) ? props.selectedNav.navTitle : navTitle
        }
        let selectedRecord = this.state.selectedRecord;
        return (
            <main className="admin-main">
                <button className={(navTitle === 'reception-phone') &&
                !isEmpty(this.state.selectedNav.records) ? 'btn-disabled' : 'btn-admin'}
                        onClick={this.handleRegister}
                        disabled={(navTitle === 'reception-phone') &&
                        !isEmpty(this.state.selectedNav.records)}>新規登録
                </button>
                <button className={isEmpty(selectedRecord) ? 'btn-disabled' : 'btn-admin'}
                        onClick={this.handleUpdate}
                        disabled={isEmpty(selectedRecord)}>変更
                </button>
                <button
                    className={isEmpty(selectedRecord) ? 'btn-disabled' : 'btn-admin'}
                    onClick={this.handleDelete}
                    disabled={isEmpty(selectedRecord)}>論理削除
                </button>
                <table className="table-control" summary="">
                    <RecordList selectedNav={this.state.selectedNav}
                                handleClick={record => this.handleSelectRecord(record)}/>
                </table>
                <ReactPaginate
                    previousLabel='&laquo; 前へ'
                    nextLabel='次へ &raquo;'
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    initialPage={window.activePage}
                    forcePage={window.activePage}
                    containerClassName={"paging"}
                    activeClassName={"active"}/>
            </main>
        )
    }
}

export default C2