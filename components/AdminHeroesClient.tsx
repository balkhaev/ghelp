"use client";

import { useState } from "react";
import type { Hero } from "@/types/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function AdminHeroesClient({ heroes }: { heroes: Hero[] }) {
  const [localHeroes, setLocalHeroes] = useState<Hero[]>(heroes);

  const handleChange = (
    idx: number,
    field: keyof Hero,
    value: string | null
  ) => {
    setLocalHeroes((prev) => {
      const updated = [...prev];
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore упрощённое приведение типа
      (updated[idx] as Hero)[field] = value;
      return updated;
    });
  };

  const saveHero = async (hero: Hero) => {
    if (!hero.id) {
      // insert
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore не все поля описаны в типах supabase
      const { error } = await supabase.from("heroes").insert({
        name: hero.name,
        image: hero.image,
      });
      if (error) {
        toast.error("Ошибка: " + error.message);
      } else {
        toast.success("Герой добавлен");
      }
    } else {
      const { error } = await supabase
        .from("heroes")
        .update({ name: hero.name, image: hero.image })
        .eq("id", hero.id);
      if (error) {
        toast.error("Ошибка: " + error.message);
      } else {
        toast.success("Сохранено");
      }
    }
  };

  const deleteHero = async (id?: number) => {
    if (!id) return;
    const { error } = await supabase.from("heroes").delete().eq("id", id);
    if (error) {
      toast.error("Ошибка: " + error.message);
    } else {
      toast.success("Удалено");
      setLocalHeroes((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const addHero = () => {
    setLocalHeroes((prev) => [...prev, { name: "", image: null, builds: [] } as Hero]);
  };

  return (
    <div className="space-y-4">
      <Button onClick={addHero}>Добавить героя</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>URL изображения</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localHeroes.map((h, idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Input
                  value={h.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={h.image ?? ""}
                  onChange={(e) => handleChange(idx, "image", e.target.value)}
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" onClick={() => saveHero(h)}>
                  Сохранить
                </Button>
                {h.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteHero(h.id)}
                  >
                    Удалить
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 