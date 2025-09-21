import { signIn } from '@/auth';

export function SignIn() {
  const handleSubmit = async () => {
    await signIn();
  };

  return (
    <form action={handleSubmit}>
      <button type="submit">Sign In</button>
    </form>
  );
}
