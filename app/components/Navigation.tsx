'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeProvider";

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/history', label: 'History' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/settings', label: 'Settings' },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-black/5 dark:border-white/5">
      <nav className="mx-auto flex h-[52px] max-w-[980px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-sm shadow-orange-500/20 transition-transform group-hover:scale-105">
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-[var(--foreground)]">Redd Radar</span>
        </Link>
        
        {/* Nav Links */}
        <div className="flex items-center gap-0.5">
          <SignedIn>
            {/* Navigation pills */}
            <div className="mr-4 flex items-center rounded-full bg-black/[0.03] p-1 dark:bg-white/[0.05]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-white text-[var(--foreground)] shadow-sm dark:bg-white/10'
                      : 'text-[#86868b] hover:text-[var(--foreground)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 border-l border-black/5 pl-4 dark:border-white/5">
              <ThemeToggle />
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-7 w-7 rounded-full ring-2 ring-white/50 dark:ring-black/50 transition-all hover:ring-[var(--accent)]"
                  }
                }}
              />
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignInButton mode="modal">
                <button className="text-[13px] font-medium text-[#86868b] transition-colors hover:text-[var(--foreground)]">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--foreground)] px-4 text-[13px] font-medium text-[var(--background)] shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
                  Get Started
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
