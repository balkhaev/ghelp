import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Динамический импорт клиентского редактора, чтобы избежать SSR-ошибок
const AdminBuildsClient = dynamic(() => import("@/components/AdminBuildsClient"));

export default async function AdminBuildsPage() {
  // Загружаем героев с билдами
  const { data: heroes, error } = await supabase
    .from("heroes")
    .select("id, name, image, builds(*)")
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Редактирование билдов</CardTitle>
        </CardHeader>
      </Card>

      {/* Клиентский редактор */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore несовпадение типов */}
      {heroes && <AdminBuildsClient heroes={heroes} />}
    </div>
  );
} 