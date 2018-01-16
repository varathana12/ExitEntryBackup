/*
* This is the validation services
* Every value has to convert to halfWidth characters before validation process
* */
import {toHalfWidth} from "../../utils/transformers";
import {asYouType, isValidNumber} from '../validation/custom_libphonenumber-js'
import {checkEmailExistence} from "../../services/ajax_services";
import {ID_NAME, NAME, MEMBER_ID, COMPANY_NAME, EXIT_CONFIRMER_ID} from "../../constants/table_column_names";
/*
* import validate.js lib
* */
const validate = require("validate.js");

const TEL_PATTERN = new RegExp('^[-+()\\s0-9]+$')
const EMAIL_PATTERN = new RegExp('^[0-9a-zA-Z@._\+\-]+$');

const phoneNumberFormatter = new asYouType('JP')

/*
* Set the email constraint
* */
const EMAIL_CONSTRAINT = {
    form: {
        email: true
    }
};
/*

/*
* Validate if a value is empty
* */
export const isEmpty = (value) => {
    return validate.isEmpty(value);
};

/*
* Validate email address if it is in correct format
* */
export const isValidEmail = (email) => {
    email = toHalfWidth(email);
    if (!isEmpty(email)) {
        return isEmpty(validate({form: email}, EMAIL_CONSTRAINT));
    }
};

/*
* Validate valid characters used in email
* Allow only alphanumeric @ . _
*/
export const isValidEmailChars = (email) => {
    email = toHalfWidth(email)
    if (email) {
        email = toHalfWidth(email);
        return EMAIL_PATTERN.test(email);
    }
};

export const isExistingEmail = (data) => {
    data.email = toHalfWidth(data.email).trim().toLowerCase()
    if (isEmpty(data.id)) {
        data.id = '-';
    }
    return checkEmailExistence(data)
        .then(existence => existence)
}

/*
* Validate telephone number characters
*/
export const isValidTelChars = (tel) => {
    tel = toHalfWidth(tel)
    return TEL_PATTERN.test(tel)
}

export const isValidTel = (phoneNumber) => {
    phoneNumberFormatter.reset()
    let formattedPhoneNumber = phoneNumberFormatter.input(phoneNumber)
    let country = phoneNumberFormatter.country
    return (isValidNumber(formattedPhoneNumber, country) && !isEmpty(country))
}

export const isUnique = (list, value) => {
    value = toHalfWidth(value)
    if(isNaN(value)){
        value = value.trim()
        for (var i = 0; i < list.length; i++) {
            if (list[i][ID_NAME]== value) {
                return false;
            }
        }
    }else {
        for (var i = 0; i < list.length; i++) {
            if (list[i][EXIT_CONFIRMER_ID]==parseInt(value)) {
                return false;
            }
        }
    }



    return true;
};

export const isOverHundred = (value) => {

    return (value.length >= 100);
};

export const isMatch = (list,value)=>{

    if(isNaN(value)){
        value = value.trim()
        for (var i = 0; i < list.length; i++) {
            if (list[i][COMPANY_NAME]+" "+list[i][NAME] +" "+list[i][MEMBER_ID]==value) {
                return true;
            }
        }
    }
    else {
        for (var i = 0; i < list.length; i++) {
            if (list[i][MEMBER_ID]==parseInt(value)) {
                return true;
            }
        }
    }


    return false;
}
export const isInHall = (list,value)=>{
    for(var i=0;i<list.length;i++){
        if(list[i][MEMBER_ID]==value){
            return true
        }
    }
    return false
}