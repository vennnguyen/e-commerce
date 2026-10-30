

import { SignUpForm } from "@/components/auth/signup-form";
export default function SignUpPage() {
  return (
    <div className="bg-gradient-to-b from-primary/20 via-background to-primary/20 flex min-h-svh flex-col items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-xs md:max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
}
