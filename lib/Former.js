import FieldController from './FieldController.js';
import { useEffect, useState, } from 'react';
export default class Former {
    settings;
    fields;
    submitFn = () => { };
    valid = true;
    setValid = () => { };
    submitted = false;
    setSubmitted = () => { };
    constructor(settings) {
        this.settings = settings;
        let fields = {};
        for (const [key, value] of Object.entries(settings.defaultValues)) {
            fields[key] = new FieldController(value, this);
        }
        this.fields = fields;
    }
    /**
     * Allows you get the value of any field.
     * @param name - name of the field to get
     */
    getValue = (name) => {
        for (const [key, value] of Object.entries(this.fields)) {
            if (key === name) {
                return value.getValue();
            }
        }
    };
    /**
     * Goes through all child FieldControllers and calls the validation functions.
     * @param fields
     */
    validateFields = (fields) => {
        for (const field of Object.values(fields)) {
            this.fields[field].doValidation();
        }
    };
    /**
     * When a field changes this will go through all the fields
     * and figure out if any of them are invalid
     */
    onFieldChange = () => {
        for (const value of Object.values(this.fields)) {
            if (value.hasErrors()) {
                this.setValid(false);
                return;
            }
        }
        this.setValid(true);
    };
    /**
     * To be called where you use other react hooks. This Fn
     * calls the useState function on all child FieldControllers
     * as well as all useStates used by the main parent controller.
     * @param onSubmitFn - a function to call onSubmit
     */
    useForm = (onSubmitFn) => {
        if (typeof onSubmitFn === 'function') {
            this.submitFn = onSubmitFn;
        }
        for (const value of Object.values(this.fields)) {
            value.useForm();
        }
        [this.valid, this.setValid] = useState(true);
        [this.submitted, this.setSubmitted] = useState(false);
        return this;
    };
    /**
     * Creates a new object with the existing values from the filed controller.
     */
    getValues = () => {
        let out = {};
        for (const [key, value] of Object.entries(this.fields)) {
            out[key] = value.getValue();
        }
        return out;
    };
    /**
     * Allows you to set values of your form.
     * @param {Partial<T>} values
     */
    setValues = (values) => {
        for (const [key, value] of Object.entries(values)) {
            this.fields[key].setValue(value);
        }
    };
    /**
     * Handles the main form submit logic. If all fields are valid then calls the submit function.
     */
    submit = () => {
        let canSubmit = true;
        for (const value of Object.values(this.fields)) {
            if (!value.canSubmit()) {
                canSubmit = false;
            }
        }
        if (!canSubmit) {
            this.setValid(false);
            return;
        }
        this.setValid(true);
        if (typeof this.submitFn === 'function') {
            this.submitFn(this.getValues());
        }
    };
    /**
     * Handles the form submit event by preventing the forum from
     * submitting and then executing the main submit function.
     * @param e
     */
    onSubmitEvent = (e) => {
        e.preventDefault();
        this.submit();
    };
    /**
     * A convince function if you want to set a form button
     * to do the submit and not use the form onSubmit.
     */
    onClickSubmit = () => {
        this.submit();
    };
    /**
     * If you want to apply the props automatically to a button
     * to do the form submit.
     */
    getSubmitButtonProps = () => {
        return {
            onClick: this.submit,
        };
    };
    /**
     * If you want your form onSubmit to handle the form submit
     * then you this to easily add the proper handlers.
     */
    getFormProps = () => {
        return {
            onSubmit: this.onSubmitEvent,
        };
    };
    /**
     * Allows you to easily create a new field. Will automatically pass
     * the proper FieldController to the children elements.
     * @param {FieldProps<T>} props
     */
    Field = (props) => {
        const controller = this.fields[props.name];
        // this should never happen but if it does...
        if (!controller) {
            throw new Error(`No controller found with name: ${String(props.name)}!`);
        }
        // update all our props to our controller
        useEffect(() => {
            controller.validate = props.validate ? props.validate : undefined;
            controller.validateClean =
                typeof props.validateClean === 'boolean' ? props.validateClean : false;
            controller.validateOnSubmit =
                typeof props.validateOnSubmit === 'boolean'
                    ? props.validateOnSubmit
                    : true;
            controller.validateOtherFields =
                props.validateOtherFields?.constructor === Array
                    ? props.validateOtherFields
                    : [];
            controller.transformValue = props.transformValue
                ? props.transformValue
                : undefined;
        }, [props]);
        return props.children(controller);
    };
    reset = () => {
        this.setValid(true);
        this.setSubmitted(false);
        for (const value of Object.values(this.fields)) {
            value.reset();
        }
    };
}
