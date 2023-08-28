import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import Former from './Former';

enum FieldType {
  String,
  Number,
  Boolean,
}

export type FieldTypes = string | number | boolean;

interface FieldState {
  value: FieldTypes;
  dirty: boolean;
  errors: string[];
}

export function newFieldState(value: FieldTypes): FieldState {
  return {
    value: value,
    dirty: false,
    errors: [],
  };
}

export default class FieldController<T> {
  defaultState: FieldState;
  state: FieldState = null as any;
  setState: Dispatch<SetStateAction<FieldState>> = null as any;
  fieldType: FieldType;
  validate: undefined | ((value: FieldTypes) => any[] | void);
  transformValue: undefined | ((value: FieldTypes) => FieldTypes);
  validateClean: boolean = false;
  validateOnSubmit: boolean = true;
  validateOtherFields: (keyof T)[] = [];
  parentController: Former<T>;
  submitted = false;
  hasValidated = false;
  // react does not update states immediately after calling setState
  // so this is a copy of what the true state is so that the parent
  // controller can check and pass the proper values around before render
  trueState: FieldState;

  constructor(defaultValue: FieldTypes, parentController: Former<T>) {
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
    [this.state, this.setState] = useState<FieldState>(this.defaultState);
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
  beforeValidation = (value: FieldTypes): string[] => {
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
  updateState = (state: FieldState) => {
    this.setState(state);
    this.trueState = state;
  };

  /**
   * Sets a value and runs validations if it should.
   * Also notifies the parent controller of a field change.
   * @param value
   */
  setValue = (value: FieldTypes) => {
    let errors: string[] = [];
    if (
      this.validateClean ||
      !this.validateOnSubmit ||
      (this.validateOnSubmit && this.submitted)
    ) {
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
  onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: FieldTypes;
    switch (this.fieldType) {
      case FieldType.Boolean:
        value = !this.trueState.value;
        break;
      case FieldType.Number:
        value = Number(e.target.value);
        break;
      default:
        value = e.target.value;
    }

    console.log(value);

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
  hasErrors = (): boolean => {
    return this.trueState.errors.length > 0;
  };
}
