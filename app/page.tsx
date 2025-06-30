import { HeroesGrid } from "@/components/HeroesGrid";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function GuidesHome() {
  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return <div className="container mx-auto p-8">Ошибка загрузки данных</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl md:text-5xl font-bold">
            Гайды по героям
          </CardTitle>
          <CardDescription>
            Найдите своего любимого героя или откройте для себя новых
          </CardDescription>
        </CardHeader>
        <CardContent>
          {heroes && <HeroesGrid heroes={heroes as any} />}
        </CardContent>
        <CardFooter className="justify-center">
          <Badge variant="secondary">Всего героев: {heroes?.length}</Badge>
        </CardFooter>
      </Card>
    </div>
  );
} 