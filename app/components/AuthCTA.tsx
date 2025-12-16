'use client';

import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";

interface AuthCTAProps {
  className?: string;
  children?: React.ReactNode;
}

export function AuthCTAButton({ className, children }: AuthCTAProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();

  const handleClick = () => {
    openSignIn({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    });
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <button className={className} disabled>
        {children || (
          <>
            Loading...
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </>
        )}
      </button>
    );
  }

  // User is signed in - show dashboard link
  if (isSignedIn) {
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

  // User is NOT signed in - show sign-in button (pure button, no anchor)
  return (
    <button onClick={handleClick} className={className}>
      {children || (
        <>
          Start free trial
          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </button>
  );
}

interface PricingCTAProps {
  className: string;
  ctaText: string;
}

export function PricingCTA({ className, ctaText }: PricingCTAProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();

  const handleClick = () => {
    openSignIn({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard',
    });
  };

  if (!isLoaded) {
    return (
      <button className={className} disabled>
        Loading...
      </button>
    );
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard" className={className}>
        Go to Dashboard
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className={className}>
      {ctaText}
    </button>
  );
}
