"use client";

import { useState } from "react";
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

interface Hero {
  id?: number;
  name: string;
  image: string | null;
}

export default function AdminHeroesClient({ heroes }: { heroes: Hero[] }) {
  const [localHeroes, setLocalHeroes] = useState<Hero[]>(heroes);

  const handleChange = (
    idx: number,
    field: keyof Hero,
    value: any
  ) => {
    setLocalHeroes((prev) => {
      const updated = [...prev];
      (updated[idx] as any)[field] = value;
      return updated;
    });
  };

  const saveHero = async (hero: Hero) => {
    if (!hero.id) {
      // insert
      const { id: _ignore, ...rest } = hero as any;
      const { error } = await supabase.from("heroes").insert(rest as any);
      if (error) {
        toast.error("Ошибка: " + error.message);
      } else {
        toast.success("Герой добавлен");
      }
    } else {
      const { id: _ignore, ...rest } = hero as any;
      const { error } = await supabase
        .from("heroes")
        .update(rest as any)
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
    setLocalHeroes((prev) => [...prev, { name: "", image: null }]);
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