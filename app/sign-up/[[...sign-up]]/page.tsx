"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      suppressHydrationWarning
    >
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-slate-800 hover:bg-slate-900",
            card: "shadow-xl",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}