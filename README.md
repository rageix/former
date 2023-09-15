# former

## What is it

A headless [React](https://react.dev) form component. It allows you to 
specify form fields, which will then create child form controllers 
with separate states. All form controls will update in their own 
independent states, allow the field to update just itself instead of all fields.

Being headless means that it does not create any form components itself and
works with any forms you already have.

## How to install

`npm install --save @rageix/former`

## Examples

See the `/examples` directory.

## Getting started

Create a new instance of the Former class and define the initial form.

```
import Former from '@rageix/former';

// define our form
interface SignUpForm {
  email: string;
  password: string;
  passwordAgain: string;
  count: number,
  terms: boolean;
}

// create a new instances of the Former class
const form = new Former<SignUpForm>({
  defaultValues: {
    email: '',
    password: '',
    passwordAgain: '',
    count: 10,
    terms: true,
  },
});
```

Keep in mind that form fields can be strings, numbers, and booleans. When the form field 
changes it will automatically be cast into the same type.

## Hooks
In your form call the `useForm()` method which will call the proper `useState` functions 
for all the child components. This `useForm()` method takes a callback function that fires
when the form submits.

```
function App() {
  form.useForm((value: SignUpForm) => {
    // do submit logic here
    console.log(value);
  });
```

Now you want to setup your form and attach the proper handlers to the form element.

```
<form {...form.getFormProps()}>
  {/* children here */}
</form>
```

The `getformProps()` method will set the onSubmit handler to the internal Former functions.
This is optional if you do not want to use the onSubmit handler.

## Form fields
Next up add your form fields here is a simple example:

```
<form.Field
  name="email"
  validate={(value) => {
    const result = z.string().email().safeParse(value);
    if (!result.success) {
      return result.error.issues.map((v) => v.message);
    }
  }}
  // this is just an example
  transformValue={(value) => value}
  children={(field) => (
    <div>
      <label htmlFor="email">Email</label>
      <input
        name="email"
        data-testid="email"
        {...field.getValueProps()}
      />
      <FormErrors errors={field.state.errors} />
    </div>
  )}
/>
```

Let's talk about this from top to bottom.

The `name` prop is the name of the field you used in defaultValues when creating a 
new instance of Former.

The `validate` props is a function used to validate the field. It returns a string[] of 
errors.

The `transformValue` prop is used to transform the input value. The user enters a value,
the onChange handler is called, Former converts it into the type that was set in 
`defaultValues`, then the `transformValue` function is called if it is set. This method
takes an argument of the value, and you can return whatever value you want and that is the
value that gets set.

The `children` props is the standard React child prop. However, a controller for the 
field is passed as the first argument. This controller contains everything about the 
field.

The `field.getValueProps()` method returns the `value` and `onChange` handlers for the 
component. This is the method to use when your component needs a value prop passed.
There is a `field.getCheckedProps()` for when the filed needs a `checked` prop.

To access the field errors you can do so though `field.state.errors` which is a string[].

## Form button

Lastly is some kind of submit button for the form, and you have 2 options. 

1. If you used the `getFormProps()` method on your form element you just need a basic
submit button.

```
<button
  type="submit"
  disabled={!form.valid}
>
  Submit
</button>
```

2. If you want the form button to trigger the submit, or handle it in another way you can add
the `form.getSubmitButtonProps()` method to any component and it will add the proper click
handler to whatever component it's on. You could also directly call the `form.submit()` method
if you wanted to manually trigger a submit.


## Getters

`form.getValue(name)` - Allows you to get the value of any field by it's name.

`form.getValues()` - Allows you to get all the values in the form.

## Setters

`form.setValues(values)` - Allows you to pass in a Partial of your form data to set any fields.
