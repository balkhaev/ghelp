import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import HeroBuilds from "@/components/HeroBuilds";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: { bid?: string };
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");

const isDev = process.env.NODE_ENV === "development";

export default async function HeroPage({ params, searchParams }: PageProps) {
  const { slug } = await params;

  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image, builds(*)");

  if (error || !heroes) {
    console.error(error);
    return <div className="container mx-auto p-8">Ошибка загрузки данных</div>;
  }

  const hero = heroes.find((h: any) => slugify(h.name) === slug);

  if (!hero) {
    return <div className="container mx-auto p-8">Герой не найден</div>;
  }

  // определяем выбранный билд
  let selectedIdx = 0;
  if (searchParams?.bid && hero?.builds) {
    const idx = (hero.builds as any[]).findIndex((b) => b.id?.toString() === searchParams.bid);
    if (idx !== -1) selectedIdx = idx;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-5xl overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <Image
            src={
              isDev
                ? `/images/heroes/${slug}.png`
                : hero.image ?? `/images/heroes/${slug}.png`
            }
            alt={hero.name}
            width={200}
            height={200}
            className="rounded-lg flex-shrink-0 self-start"
          />
          <div className="flex flex-col justify-center gap-2 text-center md:text-left">
            <CardTitle className="text-4xl font-bold">{hero.name}</CardTitle>
            <CardDescription>
              Доступно билдов: {hero.builds?.length ?? 0}
            </CardDescription>
          </div>
        </div>
      </Card>

      <div className="w-full max-w-5xl">
        <HeroBuilds builds={(hero.builds ?? []) as any} selectedIndex={selectedIdx} />
      </div>
    </div>
  );
} 