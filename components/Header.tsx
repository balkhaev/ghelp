"use client"

import Link from "next/link";

export function Header() {
  return (
    <header className="bg-card/70 backdrop-blur supports-backdrop-blur:bg-card/60 border-b border-border sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-wide hover:text-primary transition-colors"
        >
          Gladiator&apos;s Guide
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="hover:text-primary transition-colors"
          >
            Герои
          </Link>
          <Link
            href="/builds"
            className="hover:text-primary transition-colors"
          >
            Все билды
          </Link>
          <Link
            href="/admin"
            className="hover:text-primary transition-colors"
          >
            Админка
          </Link>
        </nav>
      </div>
    </header>
  );
} 