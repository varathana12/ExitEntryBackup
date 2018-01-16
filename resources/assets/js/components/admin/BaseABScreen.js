import React from 'react'
import BaseAdminComponent from "./BaseAdminComponent";

class BaseABScreen extends BaseAdminComponent {
    constructor() {
        super();

        this.hasFormChanged = false;
        this.submitClicked = false;
        this.isRegisterPage = true;
        this.submitBtn = null;
    }
}

export default BaseABScreen