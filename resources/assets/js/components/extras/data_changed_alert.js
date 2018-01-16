import swal from 'sweetalert'
/**
 * Display an alert after attempting to register or update
 * @param isRegisterPage : page type (register or update)
 * @param pageName : model name (visitor, exit confirmer, administrator...)
 * @param status : registration or updation status (true or false)
 */
export function dataChangedAlert(isRegisterPage, pageName, status) {
    if (status !== true && status !== false)
        return swal('We are sorry!', 'There was some problem. Please try again.', 'warning');
    return swal({
        title: status ? 'Done!' : 'Failed!',
        text: status ? `The ${pageName} has been successfully ${isRegisterPage ? 'registered' : 'updated'}.` :
            `The ${pageName} has not been ${isRegisterPage ? 'registered' : 'updated'}.`,
        icon: status ? 'success' : 'error'
    })
        .then(status => status)
        .catch(error => swal('We are sorry!', 'There was some problem. Please try again.', 'error'))
}