import { useState } from 'react';
var FieldType;
(function (FieldType) {
    FieldType[FieldType["String"] = 0] = "String";
    FieldType[FieldType["Number"] = 1] = "Number";
    FieldType[FieldType["Boolean"] = 2] = "Boolean";
})(FieldType || (FieldType = {}));
export function newFieldState(value) {
    return {
        value: value,
        dirty: false,
        errors: [],
    };
}
export default class FieldController {
    defaultState;
    state = null;
    setState = null;
    fieldType;
    validate;
    transformValue;
    validateClean = false;
    validateOnSubmit = true;
    validateOtherFields = [];
    parentController;
    submitted = false;
    hasValidated = false;
    // react does not update states immediately after calling setState
    // so this is a copy of what the true state is so that the parent
    // controller can check and pass the proper values around before render
    trueState;
    constructor(defaultValue, parentController) {
        const newState = newFieldState(defaultValue);
        this.defaultState = newState;
        this.trueState = newState;
        this.parentController = parentController;
        switch (typeof defaultValue) {
            case 'string':
                this.fieldType = FieldType.String;
                break;
            case 'number':
                this.fieldType = FieldType.Number;
                break;
            case 'boolean':
                this.fieldType = FieldType.Boolean;
        }
    }
    /**
     * Calls useState when you should be calling your hooks.
     */
    useForm = () => {
        [this.state, this.setState] = useState(this.defaultState);
    };
    /**
     * Returns if this field is valid and ok to submit.
     */
    canSubmit = () => {
        this.submitted = true;
        if (!this.hasValidated) {
            this.doValidation();
        }
        return !this.hasErrors();
    };
    /**
     * A small helper method to just set hasValidated before doing validation.
     * @param value
     */
    beforeValidation = (value) => {
        this.hasValidated = true;
        if (this.validate) {
            return this.validate(value) || [];
        }
        return [];
    };
    /**
     * Another small function for validation purposes.
     */
    doValidation = () => {
        const errors = this.beforeValidation(this.trueState.value) || [];
        this.updateState({ ...this.state, errors: errors });
    };
    /**
     * Returns the value for this field.
     */
    getValue = () => {
        return this.trueState?.value;
    };
    /**
     * Updates the state and trueState.
     * @param state
     */
    updateState = (state) => {
        this.setState(state);
        this.trueState = state;
    };
    /**
     * Sets a value and runs validations if it should.
     * Also notifies the parent controller of a field change.
     * @param value
     */
    setValue = (value) => {
        let errors = [];
        if (this.validateClean ||
            !this.validateOnSubmit ||
            (this.validateOnSubmit && this.submitted)) {
            errors = this.beforeValidation(value);
        }
        this.updateState({
            ...this.state,
            dirty: true,
            value: value,
            errors: errors,
        });
        if (Object.values(this.validateOtherFields).length > 0) {
            this.parentController.validateFields(this.validateOtherFields);
        }
        this.parentController.onFieldChange();
    };
    /**
     * The main field onChange handler. Gets the value from the field
     * converts it to the type we started out with.
     * Allows you to then transform the value if you want before seeing it.
     * @param e
     */
    onChange = (e) => {
        let value;
        switch (this.fieldType) {
            case FieldType.Boolean:
                value = !this.trueState.value;
                break;
            case FieldType.Number:
                value = Number(e.currentTarget?.value);
                break;
            default:
                value = e.currentTarget?.value;
        }
        if (this.transformValue) {
            value = this.transformValue(value);
        }
        this.setValue(value);
    };
    /**
     * Returns the props for a checked component
     * like a checkbox.
     */
    getCheckedProps = () => {
        return {
            checked: Boolean(this.state.value),
            onChange: this.onChange,
        };
    };
    /**
     * Returns props for a standard text input.
     */
    getValueProps = () => {
        return {
            value: String(this.state.value),
            onChange: this.onChange,
        };
    };
    /**
     * Returns if the field has any errors.
     */
    hasErrors = () => {
        return this.trueState.errors.length > 0;
    };
}
