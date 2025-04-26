import LoginForm from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Login - SupaNext Template',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <LoginForm />
    </div>
  );
}