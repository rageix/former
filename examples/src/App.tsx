import './App.css';
import Former from '../../src/Former';
import { z } from 'zod';

interface SignUpForm {
  email: string;
  password: string;
  passwordAgain: string;
  count: number,
  terms: boolean;
}

const form = new Former<SignUpForm>({
  defaultValues: {
    email: '',
    password: '',
    passwordAgain: '',
    count: 10,
    terms: true,
  },
});

interface ErrorProps {
  errors: string[];
}

function FormErrors(props: ErrorProps) {
  return (
    <div>
      {props.errors.map((v, i) => (
        <div key={i} style={{ color: 'red' }}>{v}</div>
      ))}
    </div>
  );
}

function App() {
  form.useForm((value: SignUpForm) => {
    console.log(value);
  });

  return (
    <div>
      <form {...form.getFormProps()}>
        <form.Field
          name="email"
          validate={(value) => {
            const result = z.string().email().safeParse(value);
            if (!result.success) {
              return result.error.issues.map((v) => v.message);
            }
          }}
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
        <form.Field
          name="password"
          validateOtherFields={["passwordAgain"]}
          validate={(value) => {
            const result = z.string().min(1).refine(
              (val) => {
                return val === form.getValues().passwordAgain;
              },
              {
                message: 'Password must match Password (Again)',
              },
            ).safeParse(value);
            if (!result.success) {
              return result.error.issues.map((v) => v.message);
            }
          }}
          children={(field) => (
            <div>
              <label htmlFor="password">Password</label>
              <input
                name="password"
                data-testid="password"
                {...field.getValueProps()}
              />
              <FormErrors errors={field.state.errors} />
            </div>
          )}
        />
        <form.Field
          name="passwordAgain"
          validateOtherFields={["password"]}
          validate={(value) => {
            const result = z
              .string()
              .min(1)
              .refine(
                (val) => {
                  return val === form.getValues().password;
                },
                {
                  message: 'Password (Again) must match Password.',
                },
              )
              .safeParse(value);
            if (!result.success) {
              return result.error.issues.map((v) => v.message);
            }
          }}
          children={(field) => (
            <div>
              <label htmlFor="passwordAgain">Password (Again)</label>
              <input
                name="passwordAgain"
                data-testid="passwordAgain"
                {...field.getValueProps()}
              />
              <FormErrors errors={field.state.errors} />
            </div>
          )}
        />
        <form.Field
          name="count"
          transformValue={(value) => (value as number) < 0 ? 0 : value}
          children={(field) => (
            <div>
              <label htmlFor="count">Count</label>
              <input
                type="number"
                id="count"
                data-testid="count"
                {...field.getValueProps()}
              />
              <FormErrors errors={field.state.errors} />
            </div>
          )}
        />
        <form.Field
          name="terms"
          validate={(value) => {
            const result = z
              .boolean()
              .refine(
                (val) => {
                  return val;
                },
                {
                  message: 'You must accept the terms before creating an account.',
                },
              )
              .safeParse(value);
            if (!result.success) {
              return result.error.issues.map((v) => v.message);
            }
          }}
          children={(field) => (
            <div>
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                data-testid="acceptTerms"
                aria-describedby="termsErrors"
                {...field.getCheckedProps()}
              />
              <label
                className="ml-3"
                htmlFor="acceptTerms"
              >
                <span>I have read and accept the </span>
                <a
                  href="#"
                  target="_blank"
                >
                  terms of service
                </a>
                .
              </label>
              <FormErrors errors={field.state.errors} />
            </div>
          )}
        />
        <div>is valid: {form.valid ? 'true' : 'false'}</div>
        <div>
          <button
            type="submit"
            disabled={!form.valid}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
