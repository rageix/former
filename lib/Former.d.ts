import FieldController, { FieldTypes } from './FieldController';
import { Dispatch, FormEvent, FormHTMLAttributes, ReactElement, SetStateAction } from 'react';
interface FieldProps<T> {
    name: keyof T;
    children: (arg: FieldController<T>) => ReactElement;
    validate?: (value: FieldTypes) => any[] | void;
    validateClean?: boolean;
    validateOnSubmit?: boolean;
    validateOtherFields?: (keyof T)[];
    transformValue?: (value: FieldTypes) => FieldTypes;
}
type FieldObj<T> = {
    [P in keyof T]: FieldController<T>;
};
type FieldObjValue<T> = {
    [P in keyof T]: FieldTypes;
};
interface Settings<T> {
    defaultValues: FieldObjValue<T>;
}
export default class Former<T> {
    settings: Settings<T>;
    fields: FieldObj<T>;
    submitFn: (arg: T) => void;
    valid: boolean;
    setValid: Dispatch<SetStateAction<boolean>>;
    submitted: boolean;
    setSubmitted: Dispatch<SetStateAction<boolean>>;
    constructor(settings: Settings<T>);
    /**
     * Allows you get the value of any field.
     * @param name - name of the field to get
     */
    getValue: (name: keyof T) => FieldTypes | undefined;
    /**
     * Goes through all child FieldControllers and calls the validation functions.
     * @param fields
     */
    validateFields: (fields: (keyof T)[]) => void;
    /**
     * When a field changes this will go through all the fields
     * and figure out if any of them are invalid
     */
    onFieldChange: () => void;
    /**
     * To be called where you use other react hooks. This Fn
     * calls the useState function on all child FieldControllers
     * as well as all useStates used by the main parent controller.
     * @param onSubmitFn - a function to call onSubmit
     */
    useForm: (onSubmitFn?: ((arg: T) => void) | undefined) => this;
    /**
     * Creates a new object with the existing values from the filed controller.
     */
    getValues: () => T;
    /**
     * Allows you to set values of your form.
     * @param {Partial<T>} values
     */
    setValues: (values: Partial<T>) => void;
    /**
     * Handles the main form submit logic. If all fields are valid then calls the submit function.
     */
    submit: () => void;
    /**
     * Handles the form submit event by preventing the forum from
     * submitting and then executing the main submit function.
     * @param e
     */
    onSubmitEvent: (e: FormEvent<HTMLFormElement>) => void;
    /**
     * A convince function if you want to set a form button
     * to do the submit and not use the form onSubmit.
     */
    onClickSubmit: () => void;
    /**
     * If you want to apply the props automatically to a button
     * to do the form submit.
     */
    getSubmitButtonProps: () => FormHTMLAttributes<HTMLButtonElement>;
    /**
     * If you want your form onSubmit to handle the form submit
     * then you this to easily add the proper handlers.
     */
    getFormProps: () => FormHTMLAttributes<HTMLFormElement>;
    /**
     * Allows you to easily create a new field. Will automatically pass
     * the proper FieldController to the children elements.
     * @param {FieldProps<T>} props
     */
    Field: (props: FieldProps<T>) => ReactElement<any, string | import("react").JSXElementConstructor<any>>;
}
export {};
