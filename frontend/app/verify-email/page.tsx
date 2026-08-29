"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing in the request link.");
      setVerifying(false);
      return;
    }

    api.verifyEmail(token)
      .then(() => {
        setSuccess(true);
        setVerifying(false);
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Invalid or expired token.");
        setVerifying(false);
      });
  }, [token, router]);

  return (
    <div className="bg-white border border-[#EAEAE8] rounded-2xl p-8 max-w-md w-full text-center shadow-sm space-y-6">
      {/* Logo */}
      <div className="flex justify-center mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="FrameUp Logo" className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
      </div>

      {verifying && (
        <div className="space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Verifying Email Address</h1>
          <p className="text-xs text-gray-500">Checking verification status. Please do not close this window...</p>
        </div>
      )}

      {!verifying && success && (
        <div className="space-y-4">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Email Verified Successfully!</h1>
          <p className="text-xs text-gray-500">Your account is now activated. Redirecting you to the dashboard...</p>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-block text-xs font-semibold bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-indigo-500 transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {!verifying && error && (
        <div className="space-y-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Verification Failed</h1>
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg leading-relaxed">{error}</p>
          <p className="text-xs text-gray-500">The verification link may have expired or is invalid.</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/signup" className="text-xs font-semibold bg-gray-900 text-white px-6 py-2.5 rounded-lg shadow-sm hover:bg-gray-800 transition-all">
              Back to Sign Up
            </Link>
            <Link href="/login" className="text-xs font-semibold text-indigo-600 hover:underline">
              Log In instead
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Suspense fallback={
        <div className="bg-white border border-[#EAEAE8] rounded-2xl p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
          <p className="text-xs font-semibold text-gray-600">Loading verification details...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
