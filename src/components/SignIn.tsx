'use client';

import { signIn } from '@/auth';

export function SignIn() {
  const credentialsAction = (formData: FormData) => {
    signIn('credentials', formData);
  };

  const nodemailAction = (formData: FormData) => {
    signIn('credentials', formData);
  };

  return (
    <div>
      <form action={credentialsAction}>
        <label htmlFor="credentials-email">
          Email
          <input type="email" id="credentials-email" name="email" />
        </label>
        <label htmlFor="credentials-password">
          Password
          <input type="password" id="credentials-password" name="password" />
        </label>
        <input type="submit" value="Sign In" />
      </form>
      <form action={nodemailAction}>
        <button type="submit">Sign In using Magic link</button>
      </form>
    </div>
  );
}
