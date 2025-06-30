"use client"

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { UserDropdown } from "@/components/UserDropdown";

export function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

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
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-primary transition-colors"
            >
              Админка
            </Link>
          )}

          {session ? (
            <UserDropdown />
          ) : (
            <button
              onClick={() => signIn("steam")}
              className="hover:text-primary transition-colors"
            >
              Войти через Steam
            </button>
          )}
        </nav>
      </div>
    </header>
  );
} 