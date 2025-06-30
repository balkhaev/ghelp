"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Build {
  id?: number;
  talents: Record<string, string>;
  branch: Record<string, string>;
  shard: string | null;
  crit_importance: string | null;
  power: string | number | null;
}

interface Hero {
  id: number;
  name: string;
  image: string | null;
  builds: Build[];
}

type BuildItem = {
  heroId: number;
  heroName: string;
  heroImage: string | null;
  build: Build;
  buildIndex: number; // номер билда у героя начиная с 1
};

// helper to slugify hero name (for dev image paths)
const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");

const isDev = process.env.NODE_ENV === "development";

// утилита для подсветки силы (скопировано из BuildMetrics)
function getPowerBadgeClass(powerVal: Build["power"]) {
  if (powerVal === null || powerVal === undefined) return "bg-muted text-foreground";

  if (typeof powerVal === "string") {
    const digits = powerVal.replace(/\D/g, "");
    if (digits === "34" || digits === "43") {
      return "bg-gradient-to-r from-yellow-400 to-green-500 text-black";
    }
    if (digits.length > 0) {
      powerVal = Number(digits[0]);
    }
  }
  const p = typeof powerVal === "number" ? powerVal : Number(powerVal);
  if (isNaN(p)) return "bg-muted text-foreground";
  if (p >= 5) return "bg-red-600 text-white";
  if (p === 4) return "bg-yellow-400 text-black";
  if (p === 3) return "bg-green-600 text-white";
  if (p === 2) return "bg-gray-500 text-white";
  return "bg-muted text-foreground";
}

export default function AllBuildsClient({ heroes }: { heroes: Hero[] }) {
  // формируем плоский список билдов
  const buildItems: BuildItem[] = useMemo(() => {
    return heroes.flatMap((h) =>
      (h.builds ?? []).map((b, idx) => ({
        heroId: h.id,
        heroName: h.name,
        heroImage: h.image,
        build: b,
        buildIndex: idx + 1,
      }))
    );
  }, [heroes]);

  // состояния фильтров
  const [heroQuery, setHeroQuery] = useState<string>("");
  const [powerFilter, setPowerFilter] = useState<string>("all");

  // фильтрация
  const filteredItems = useMemo(() => {
    return buildItems.filter((item) => {
      // фильтр по герою (по подстроке)
      if (heroQuery.trim()) {
        const q = heroQuery.toLowerCase();
        if (!item.heroName.toLowerCase().includes(q)) return false;
      }

      // фильтр по power
      if (powerFilter !== "all") {
        // вытащим первую цифру силы
        const digits = typeof item.build.power === "string"
          ? item.build.power.replace(/\D/g, "")
          : item.build.power?.toString() ?? "";
        const firstDigit = digits.charAt(0);
        if (firstDigit !== powerFilter) return false;
      }

      return true;
    });
  }, [buildItems, heroQuery, powerFilter]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Панель фильтров */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Поиск героя..."
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            className="md:flex-1"
          />

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Сила:</span>
            <Select
              value={powerFilter}
              onValueChange={(v) => setPowerFilter(v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Сетка билдов */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-muted-foreground">Ничего не найдено</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center">
          {filteredItems.map((item, idx) => (
            <Card key={idx} className="w-full max-w-sm p-4 flex flex-col gap-3 items-center text-center">
              <Link href={`/guides/${slugify(item.heroName)}?bid=${item.build.id}`} className="flex flex-col items-center gap-3">
                {/* Картинка героя */}
                <Image
                  src={
                    isDev
                      ? `/images/heroes/${slugify(item.heroName)}.png`
                      : item.heroImage ?? `/images/heroes/${slugify(item.heroName)}.png`
                  }
                  alt={item.heroName}
                  width={64}
                  height={64}
                  className="rounded-md object-contain"
                />

                {/* Имя героя */}
                <div className="text-sm font-medium leading-snug">
                  {item.heroName}
                </div>

                {/* Метка силы */}
                <div className={`${getPowerBadgeClass(item.build.power)} px-3 py-1 rounded-md text-sm font-semibold`}>
                  {item.build.power ?? "-"}
                </div>

                {/* Иконки стилей */}
                <div className="flex flex-wrap justify-center gap-2">
                  {(["main1", "main2", "alt"] as const)
                    .flatMap((key) => {
                      const val = (item.build.branch as Record<string, string>)[key];
                      return val ? val.split("/").map((s) => s.trim()) : [];
                    })
                    .filter((s) => s.length > 0)
                    .map((style) => (
                      <Link key={style} href={`/styles/${encodeURIComponent(style)}`}>
                        <Image
                          src={`/images/styles/${style}.png`}
                          alt={style}
                          width={40}
                          height={40}
                          className="object-contain hover:scale-105 transition-transform"
                        />
                      </Link>
                    ))}
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 