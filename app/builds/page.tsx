import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

// динамический импорт чтобы избежать ошибок SSR из-за Client component
const AllBuildsClient = dynamic(() => import("@/components/AllBuildsClient"));

export default async function AllBuildsPage() {
  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image, builds(*)")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return <div className="container mx-auto p-8">Ошибка загрузки данных</div>;
  }

  if (!heroes || heroes.length === 0) {
    return <div className="container mx-auto p-8">Билды не найдены</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl md:text-5xl font-bold">
            Все билды
          </CardTitle>
          <CardDescription>
            Просмотрите доступные билды для всех героев
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Грид билдов */}
      <AllBuildsClient heroes={heroes as any} />
    </div>
  );
} 