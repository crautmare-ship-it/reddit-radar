'use client';

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface AuthCTAProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuthCTAButton({ className, children }: AuthCTAProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // If user is definitely signed in, show dashboard link
  if (isLoaded && isSignedIn) {
    return (
      <Link href="/dashboard" className={className}>
        {children || (
          <>
            Go to Dashboard
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </Link>
    );
  }

  // Default: Always show sign-in link (even during loading)
  // This ensures the button ALWAYS works, even if JS fails
  return (
    <Link href="/sign-in" className={className}>
      {children || (
        <>
          Start free trial
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </Link>
  );
}

interface PricingCTAProps {
  className: string;
  ctaText: string;
}

export function PricingCTA({ className, ctaText }: PricingCTAProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // If user is definitely signed in, show dashboard link
  if (isLoaded && isSignedIn) {
    return (
      <Link href="/dashboard" className={className}>
        Go to Dashboard
      </Link>
    );
  }

  // Default: Always show sign-in link (even during loading)
  return (
    <Link href="/sign-in" className={className}>
      {ctaText}
    </Link>
  );
}
