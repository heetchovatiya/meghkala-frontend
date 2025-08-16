// // app/(auth)/login/page.tsx
// import { LoginForm } from '@/components/auth/LoginForm';
// import Link from 'next/link';

// export default function LoginPage() {
//   return (
//     <div className="container mx-auto flex justify-center items-center py-20 px-6">
//       <div className="w-full max-w-md p-8 bg-secondary-bg/60 rounded-lg shadow-lg">
//         <h1 className="text-3xl font-serif text-heading-color text-center mb-6">
//           Welcome Back
//         </h1>
//         <LoginForm />
//         <p className="text-center text-text-color mt-6">
//           Don't have an account?{' '}
//           <Link href="/register" className="text-accent hover:underline font-semibold">
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex justify-center items-center py-20 px-6">
      <div className="w-full max-w-md p-8 bg-secondary-bg/60 rounded-lg shadow-lg">
        <h1 className="text-3xl font-serif text-heading-color text-center mb-6">
          Sign In or Sign Up
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}