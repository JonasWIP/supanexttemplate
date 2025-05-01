import RegisterForm from '@/components/forms/RegisterForm';

export const metadata = {
  title: 'Register - SupaNext Template',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <RegisterForm />
    </div>
  );
}