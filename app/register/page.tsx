import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Register - SupaNext Template',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <RegisterForm />
    </div>
  );
}