import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const AdminHeroesClient = dynamic(() => import("@/components/AdminHeroesClient"));

export default async function AdminHeroesPage() {
  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Редактирование героев</CardTitle>
        </CardHeader>
      </Card>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore несовпадение типов */}
      {heroes && <AdminHeroesClient heroes={heroes} />}
    </div>
  );
} 