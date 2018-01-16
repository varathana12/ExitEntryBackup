import { parseCustom, formatCustom, isValidNumberCustom, asYouTypeCustom } from 'libphonenumber-js'
import metadata from './metadata.full.json'

export const parse = (...args) => parseCustom(...args, metadata);
export const format = (...args) => formatCustom(...args, metadata);
export const isValidNumber = (...args) => isValidNumberCustom(...args, metadata);

export class asYouType extends asYouTypeCustom {
    constructor(country) {
        super(country, metadata)
    }
}