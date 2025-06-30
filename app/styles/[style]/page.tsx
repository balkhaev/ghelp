import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type PageProps = {
  params?: Promise<{ style: string }>;
  searchParams?: Promise<Record<string, unknown>>;
};

// helper slugify like in other components (remove diacritics, spaces etc.)
const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");

const mainBranches = ["main1", "main2", "alt"] as const;

export default async function StylePage({ params }: PageProps) {
  const { style } = params ? await params : { style: "" }; // уже без .png

  // Загружаем героев с билдами
  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image, builds(*)");

  if (error) {
    console.error(error);
    return <div className="container mx-auto p-8">Ошибка загрузки данных</div>;
  }

  // Ищем все билды, где встречается данный стиль
  const buildItems: {
    heroName: string;
    heroSlug: string;
    buildId?: number;
    buildIndex: number;
  }[] = [];

  heroes?.forEach((hero) => {
    (hero.builds ?? []).forEach((build, idx) => {
      const branches: string[] = mainBranches.flatMap((k) => {
        const val = build.branch![k as keyof typeof build.branch] as string;
        return val ? val.split("/").map((s) => s.trim()) : [];
      });
      if (branches.includes(style)) {
        buildItems.push({
          heroName: hero.name,
          heroSlug: slugify(hero.name),
          buildId: build.id,
          buildIndex: idx + 1,
        });
      }
    });
  });

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
      {/* Кард стиля */}
      <Card className="p-6 flex flex-col items-center gap-4 w-full max-w-md">
        <Image
          src={`/images/styles/${style}.png`}
          alt={style}
          width={120}
          height={120}
          className="object-contain"
        />
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold capitalize">{style}</CardTitle>
        </CardHeader>
      </Card>

      {/* Список билдов */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Билды, использующие стиль «{style}»</CardTitle>
        </CardHeader>
        <CardContent>
          {buildItems.length === 0 ? (
            <p className="text-center text-muted-foreground">Пока ни один билд не использует этот стиль</p>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
              {buildItems.map((item, idx) => (
                <Link
                  href={`/guides/${item.heroSlug}?bid=${item.buildId}`}
                  key={idx}
                  className="border rounded-md p-3 hover:bg-accent flex flex-col gap-2 text-center"
                >
                  <span className="font-medium">{item.heroName}</span>
                  <span className="text-sm text-muted-foreground">Билд {item.buildIndex}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 