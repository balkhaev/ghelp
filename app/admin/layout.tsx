import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto flex gap-6 py-4">
          <Link href="/admin/builds" className="font-semibold hover:underline">
            Билды
          </Link>
          <Link href="/admin/heroes" className="font-semibold hover:underline">
            Герои
          </Link>
          <Link href="/admin/styles" className="font-semibold hover:underline">
            Стили
          </Link>
        </nav>
      </header>
      <main className="flex-1 container mx-auto py-8">{children}</main>
      <Toaster position="top-right" />
    </div>
  );
} 