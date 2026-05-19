"use client";

import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "@/features/auth";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  // If a logged-in user lands on /login, send them home for their role.
  useEffect(() => {
    if (!hydrated || !user) return;
    router.replace(
      user.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard",
    );
  }, [hydrated, user, router]);

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-foreground p-10 text-background lg:flex">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <BookOpenCheck className="h-6 w-6" />
          BookLeaf Support
        </Link>
        <div className="space-y-4">
          <p className="text-xl leading-relaxed text-background/80">
            “BookLeaf gives our authors a calm, fast lane to support — and the
            ops team an operational dashboard worth living in.”
          </p>
          <p className="text-sm text-background/60">
            AI-assisted triage. Real-time updates. Human admins always in
            control.
          </p>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold lg:hidden">
              <BookOpenCheck className="h-5 w-5" />
              BookLeaf Support
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Use your BookLeaf credentials. Author or admin — same door.
            </p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
