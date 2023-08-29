import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import Former, { FieldTypes, TransformFn, ValidateFn } from './Former.js';
declare enum FieldType {
    String = 0,
    Number = 1,
    Boolean = 2
}
interface FieldState {
    value: FieldTypes;
    dirty: boolean;
    errors: string[];
}
export declare function newFieldState(value: FieldTypes): FieldState;
export default class FieldController<T> {
    defaultState: FieldState;
    state: FieldState;
    setState: Dispatch<SetStateAction<FieldState>>;
    fieldType: FieldType;
    validate: undefined | ValidateFn;
    transformValue: undefined | TransformFn;
    validateClean: boolean;
    validateOnSubmit: boolean;
    validateOtherFields: (keyof T)[];
    parentController: Former<T>;
    submitted: boolean;
    hasValidated: boolean;
    trueState: FieldState;
    constructor(defaultValue: FieldTypes, parentController: Former<T>);
    /**
     * Calls useState when you should be calling your hooks.
     */
    useForm: () => void;
    /**
     * Returns if this field is valid and ok to submit.
     */
    canSubmit: () => boolean;
    /**
     * A small helper method to just set hasValidated before doing validation.
     * @param value
     */
    beforeValidation: (value: FieldTypes) => string[];
    /**
     * Another small function for validation purposes.
     */
    doValidation: () => void;
    /**
     * Returns the value for this field.
     */
    getValue: () => FieldTypes;
    /**
     * Updates the state and trueState.
     * @param state
     */
    updateState: (state: FieldState) => void;
    /**
     * Sets a value and runs validations if it should.
     * Also notifies the parent controller of a field change.
     * @param value
     */
    setValue: (value: FieldTypes) => void;
    /**
     * The main field onChange handler. Gets the value from the field
     * converts it to the type we started out with.
     * Allows you to then transform the value if you want before seeing it.
     * @param e
     */
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Returns the props for a checked component
     * like a checkbox.
     */
    getCheckedProps: () => {
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    };
    /**
     * Returns props for a standard text input.
     */
    getValueProps: () => {
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    };
    /**
     * Returns if the field has any errors.
     */
    hasErrors: () => boolean;
    reset: () => void;
}
export {};
