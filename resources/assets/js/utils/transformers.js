/*
* Utility functions
* */

import {asYouType} from "../components/validation/custom_libphonenumber-js";

const phoneNumberFormatter = new asYouType('JP')
/*
* Conversion to HalfWidth characters
* */
export const toHalfWidth = (value) => {
    return value.replace(/[\uff01-\uff5e]/g, (ch) => { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0) });
};
/*
* Removing - ( ) from the tel input
* */
export const filterPhoneNumber = (value) => {
    return value.replace(/[-()\s]/g, '');
};

export const formatPhoneNumber = phoneNumber => {
    phoneNumberFormatter.reset()
    return phoneNumberFormatter.input(phoneNumber)
}