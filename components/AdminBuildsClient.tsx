"use client";

import { useState } from "react";
import type { Build, Hero } from "@/types/models";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminBuildsClient({ heroes }: { heroes: Hero[] }) {
  const [selectedHeroId, setSelectedHeroId] = useState<number>(heroes[0]?.id ?? 0);
  const [localHeroes, setLocalHeroes] = useState<Hero[]>(heroes);

  const selectedHero = localHeroes.find((h) => h.id === selectedHeroId);

  if (!selectedHero) {
    return <p>Нет героев для отображения</p>;
  }

  // Обработчик изменения поля билда
  const handleBuildChange = (
    buildIndex: number,
    field: keyof Build,
    value: string
  ) => {
    setLocalHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== selectedHeroId) return h;
        const updatedBuilds = [...(h.builds ?? [])];
        const b: Build = { ...updatedBuilds[buildIndex] };
        // @ts-expect-error JSON.parse возвращает any, приводим вручную
        b[field] = JSON.parse(value);
        updatedBuilds[buildIndex] = b;
        return { ...h, builds: updatedBuilds };
      })
    );
  };

  // Сохранение билда в Supabase
  const saveBuild = async (build: Build) => {
    if (!build.id) {
      // insert
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore Supabase типы не охватывают все поля
      const { error } = await supabase.from("builds").insert({
        hero_id: selectedHeroId,
        talents: build.talents,
        branch: build.branch,
        shard: build.shard,
        crit_importance: build.crit_importance,
        power: typeof build.power === "number" ? build.power.toString() : build.power,
      });
      if (error) {
        toast.error("Ошибка сохранения: " + error.message);
      } else {
        toast.success("Билд добавлен");
      }
    } else {
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore специфичные поля не описаны в типах
      const { error } = await supabase
        .from("builds")
        .update({
          talents: build.talents,
          branch: build.branch,
          shard: build.shard,
          crit_importance: build.crit_importance,
          power: typeof build.power === "number" ? build.power.toString() : build.power,
        })
        .eq("id", build.id);
      if (error) {
        toast.error("Ошибка сохранения: " + error.message);
      } else {
        toast.success("Билд сохранён");
      }
    }
  };

  const deleteBuild = async (buildId?: number) => {
    if (!buildId) return;
    const { error } = await supabase.from("builds").delete().eq("id", buildId);
    if (error) {
      toast.error("Ошибка удаления: " + error.message);
    } else {
      toast.success("Удалено");
      setLocalHeroes((prev) =>
        prev.map((h) =>
          h.id === selectedHeroId
            ? { ...h, builds: (h.builds ?? []).filter((b) => b.id !== buildId) }
            : h
        )
      );
    }
  };

  const addNewBuild = () => {
    const newBuild: Build = {
      talents: {
        lvl5: "",
        lvl10: "",
        lvl15: "",
      },
      branch: {
        main1: "",
        main2: "",
        alt: "",
      },
      shard: null,
      crit_importance: null,
      power: null,
    };
    setLocalHeroes((prev) =>
      prev.map((h) => {
        if (h.id !== selectedHeroId) return h;
        return { ...h, builds: [...(h.builds ?? []), newBuild] };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Выбор героя */}
      <div className="flex items-center gap-4">
        <span>Герой:</span>
        <Select
          value={selectedHeroId.toString()}
          onValueChange={(v) => setSelectedHeroId(Number(v))}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Выберите героя" />
          </SelectTrigger>
          <SelectContent>
            {localHeroes.map((h) => (
              <SelectItem key={h.id} value={h.id!.toString()}>
                {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addNewBuild}>Добавить билд</Button>
      </div>

      {/* Таблица билдов */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Power</TableHead>
            <TableHead>Shard</TableHead>
            <TableHead>Crit</TableHead>
            <TableHead>Talents (JSON)</TableHead>
            <TableHead>Branch (JSON)</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(selectedHero.builds ?? []).map((b, idx) => (
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Input
                  value={b.power ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "power", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={b.shard ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "shard", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={b.crit_importance ?? ""}
                  onChange={(e) =>
                    handleBuildChange(idx, "crit_importance", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <textarea
                  className="border rounded p-2 w-64 h-32 text-xs"
                  value={JSON.stringify(b.talents, null, 2)}
                  onChange={(e) =>
                    handleBuildChange(idx, "talents", e.target.value)
                  }
                />
              </TableCell>
              <TableCell>
                <textarea
                  className="border rounded p-2 w-64 h-32 text-xs"
                  value={JSON.stringify(b.branch, null, 2)}
                  onChange={(e) =>
                    handleBuildChange(idx, "branch", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" onClick={() => saveBuild(b)}>
                  Сохранить
                </Button>
                {b.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBuild(b.id)}
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