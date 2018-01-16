import {loadProgressBar} from 'axios-progress-bar'

const configs = {
    showSpinner: false
};

export default () => (
    loadProgressBar(configs)
)
