/*
* AJAX request services
* */

import {ADMINISTRATOR_EMAIL, EMAIL_ADDRESS, MEMBER_ID} from "../constants/table_column_names";

/*
* Get all the messages and keep them in sessionStorage
* */
export function getMessages() {
    return axios.get(`/messages`)
        .then(response => {
            let messages = {};
            response.data.forEach(message => {
                messages[message.message_id] = message.message;
            });
            sessionStorage.setItem('messages', JSON.stringify(messages));
            return messages
        })
        .catch(error => error.response.status);
};

export function getReceptionPhoneNumber() {
    return axios.get(`/${window.systemName}/reception-phone`)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function getAllEmails() {
    return axios.get(`/${window.systemName}/visitor/get-all-emails`)
        .then(response => response.data)
        .catch(error => error.response.status);
}
export function getAllVisitors() {
    return axios.get(`/${window.systemName}/visitor/get-all-visitors`)
        .then(response => response.data)
        .catch(error => error.response.status);
}
export function getAllVisitorInHall() {
    return axios.get(`/${window.systemName}/entry-exit-info/get-in-hall-visitors`)
        .then(response => response.data)
        .catch(error => error.response.status);
}

export function getAllExitConfirmer() {
    return axios.get(`/${window.systemName}/exit-confirmer/all`)
        .then(response => response.data)
        .catch(error => error.response.status);
}
export function getCompany() {
    return axios.get(`/${window.systemName}/admin/getCompany`)
        .then(response => response.data)
        .catch(error => error.response.status);
}
/*
* Retrieve any particular visitor using email address
*/
export function getVisitor(email) {
    return axios.get(`/${window.systemName}/visitor/get`, {
        params: {
            [EMAIL_ADDRESS]: email
        }
    })
        .then(response => response.data)
        .catch(error => error.response.status);
}


/**
 * Check if the email already exists
 * @returns {*|Promise<T>}
 * @param data
 */
export function checkEmailExistence(data) {
    return axios({
        method: 'get',
        url: `/${window.systemName}/${data.model}/is-existing-email`,
        params: {
            email: data.email,
            id: data.id
        }
    })
        .then(response => response.data)
        .catch(error => error.response.status)
}


export function deleteRecord(navTitle, id) {
    return axios({
        method: 'delete',
        url: `/admin/${navTitle}`,
        params: {
            id: id
        }
    })
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function getAllRecords(navTitle, pageNumber) {
    return axios({
        method: 'get',
        url: `/admin/${navTitle}/all`,
        params: {
            page: pageNumber,
        }
    })
        .then(response => response.data)
        .catch(error => console.error(error))
}

export function getLastId(resource) {
    return axios.get(`/${window.systemName}/${resource}/last-id`)
        .then(response => response.data)
        .catch(error => console.error(error.response.status))
}
export function isResetEmail(email) {
    return axios.get(`/isResetEmail`, {
        params: {
            [ADMINISTRATOR_EMAIL]: email
        }
    })
        .then(response => response.data)
        .catch(error => error.response.status);
}

/**
 * Register new visitor
 * @param visitor
 * @returns {Promise<void>}
 */
export function registerVisitor(visitor) {
    return axios.post(`/${window.systemName}/visitor`, visitor)
        .then(response => response.data)
        .catch(error => error.response.status)
}

/**
 * Update a visitor
 * @param visitor
 * @returns {Promise<void>}
 */
export function updateVisitor(visitor) {
    return axios.put(`/${window.systemName}/visitor`, visitor)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function registerExitConfirmer(exitConfirmer) {
    return axios.post(`/${window.systemName}/exit-confirmer`, exitConfirmer)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function updateExitConfirmer(exitConfirmer) {
    return axios.put(`/${window.systemName}/exit-confirmer`, exitConfirmer)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function registerReceptionPhoneNumber(receptionPhone) {
    return axios.post(`/${window.systemName}/reception-phone`, receptionPhone)
        .then(response => response.data)
        .catch(error => console.error(error.response))
}

export function updateReceptionPhoneNumber(receptionPhone) {
    return axios.put(`/${window.systemName}/reception-phone`, receptionPhone)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function registerEntryExitInfo(entryExitInfo) {
    return axios.post(`/${window.systemName}/entry-exit-info`, entryExitInfo)
        .then(response => response.data)
        .catch(error => error.response.status)
}

export function registerAdmin(admin) {
    return axios.post(`/${window.systemName}/admin`, admin)
        .then(response => response.data.status)
        .catch(error => error.response.status)
}

export function updateAdmin(admin) {
    return axios.put(`/${window.systemName}/admin`, admin)
        .then(response => response.data.status)
        .catch(error => error.response.status)
}

/**
 * Try attempting to authenticate from Exit Management System
 */
export function tryAuth() {
    return axios.get(`/${window.systemName}`)
        .then(response => response.status)
        .catch(error => error.response.status);
}
