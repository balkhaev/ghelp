"use client"

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Hero {
  id: number;
  name: string;
  image: string | null;
}

interface HeroesGridProps {
  heroes: Hero[];
}

// Преобразуем имя героя в слаг
const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");

const isDev = process.env.NODE_ENV === "development";

export function HeroesGrid({ heroes }: HeroesGridProps) {
  const [query, setQuery] = useState("");

  const filteredHeroes = useMemo(() => {
    if (!query.trim()) return heroes;
    const lower = query.toLowerCase();
    return heroes.filter((h) => h.name.toLowerCase().includes(lower));
  }, [heroes, query]);

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск героя..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md mx-auto"
      />

      {filteredHeroes.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Герой с таким именем не найден
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(140px,1fr))] justify-items-center">
          {filteredHeroes.map((hero) => {
            const slug = slugify(hero.name);
            return (
              <Link
                href={`/guides/${slug}`}
                key={slug}
                className="flex flex-col items-center gap-2 group"
              >
                <Image
                  src={
                    isDev
                      ? `/images/heroes/${slug}.png`
                      : hero.image ?? `/images/heroes/${slug}.png`
                  }
                  alt={hero.name}
                  width={120}
                  height={120}
                  className="rounded-lg object-contain group-hover:scale-105 transition-transform"
                />
                <span className="text-center text-sm font-medium">
                  {hero.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
} 