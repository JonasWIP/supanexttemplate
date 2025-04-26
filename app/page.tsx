import RestApiExample from '../components/RestApiExample';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to SupaNext Template</h1>
      <p className="text-lg mb-8">A modern template using Next.js and Supabase.</p>
      
      <div className="my-8">
        <RestApiExample />
      </div>
    </div>
  );
}
